import { Types } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

import { deserializationResultRaceRider } from '@/libs/utils/deserialization/resultRaceRider';
import { ResultRaceModel } from '@/database/mongodb/Models/ResultRace';
import { User as UserModel } from '@/database/mongodb/Models/User';
import { dtoResultsRace, dtoResultsRaceRider, dtoResultRaceRider } from '@/dto/results-race';
import { createStringCategoryAge } from '@/libs/utils/string-category';
import { processResults } from '@/libs/utils/results';
import { CategoriesModel } from '@/database/mongodb/Models/Categories';
import { TGetRaceCategoriesFromMongo } from '@/types/mongo.types';
import { RaceModel } from '@/database/mongodb/Models/Race';
import { TRiderRaceResultDto } from '@/types/dto.types';
import { DEFAULT_AGE_NAME_CATEGORY } from '@/constants/category';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { getExistCategoryNames } from '@/libs/utils/championship/category';

// types
import {
  TCategories,
  TChampionshipTypes,
  TRace,
  TRacePointsTable,
  TResultRace,
  TResultRaceDocument,
} from '@/types/models.interface';
import {
  ServerResponse,
  TGetRaceCategoriesParams,
  TProtocolRace,
  TRaceResultsServiceSetPointsParams,
  TResultRaceFromDB,
  TResultRaceRiderDeserialized,
  TRiderRaceResultDB,
  TServiceEntity,
} from '@/types/index.interface';
import { ModeratorActionLogService } from './ModerationActionLog';

/**
 * Сервис работы с результатами заезда Чемпионата.
 */
export class RaceResultService {
  private errorLogger;
  private handlerErrorDB;
  private entity: TServiceEntity;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.entity = 'raceResult';
  }

  public async getOne({
    resultId,
  }: {
    resultId: string;
  }): Promise<ServerResponse<TRiderRaceResultDto | null>> {
    try {
      const resultDB = await ResultRaceModel.findOne(
        { _id: resultId },
        { createdAt: false, updatedAt: false, creator: false }
      )
        .populate({ path: 'championship', select: ['name', 'urlSlug', 'races', 'endDate'] })
        .populate('race')
        .lean<TRiderRaceResultDB>();

      if (!resultDB) {
        throw new Error('Не найден обновляемый результат в БД!');
      }

      const categoriesDB = await CategoriesModel.findById(
        resultDB.race.categories
      ).lean<TCategories>();

      if (!categoriesDB) {
        throw new Error('Не найден конфигурация категорий для заезда!');
      }

      const resultsRaceRiderAfterDto = dtoResultRaceRider({
        result: resultDB,
        categoriesConfig: categoriesDB,
      });

      return { data: resultsRaceRiderAfterDto, ok: true, message: 'Данные заезда Чемпионата' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение результатов райдера по riderId.
   */
  public async getRiderRaceResults({
    riderId,
  }: {
    riderId: string;
  }): Promise<ServerResponse<TRiderRaceResultDto[] | null>> {
    try {
      const userDB = await UserModel.findOne({ id: riderId }, { _id: true });

      if (!userDB) {
        throw new Error(`Не найден пользователь с id: ${riderId} в БД!`);
      }

      const resultsDB = await ResultRaceModel.find(
        { rider: userDB._id },
        { createdAt: false, updatedAt: false, creator: false }
      )
        .populate({
          path: 'championship',
          select: ['name', 'urlSlug', 'endDate'],
        })
        .populate('race')
        .lean<TRiderRaceResultDB[]>();

      const resultsRaceRiderAfterDto = dtoResultsRaceRider(resultsDB);

      return { data: resultsRaceRiderAfterDto, ok: true, message: 'Данные заезда Чемпионата' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Добавление результата заезда райдера в финишный протокол.
   */
  public async post({
    dataFromFormSerialized,
    creatorId,
  }: {
    dataFromFormSerialized: FormData;
    creatorId: string;
  }): Promise<ServerResponse<null>> {
    try {
      const dataDeserialized = deserializationResultRaceRider(dataFromFormSerialized);

      // Проверка входных данных.
      this.validateRaceResultData(dataDeserialized);

      // Данные по заезду.
      const race = await this.getRace(dataDeserialized.raceId);

      // Проверка дублирование результата Райдера в Чемпионате заезда.
      await this.isRiderResultExists(dataDeserialized, race.name);

      // Проверка занят или нет стартовый номер у райдера, результат которого вносится в протокол.
      await this.isStartNumberTaken(dataDeserialized);

      // Получение _id участника, если у него есть профиль на сайте.
      const riderDB = await UserModel.findOne({ id: dataDeserialized.id }, { _id: true }).lean<{
        _id: Types.ObjectId;
      }>();

      // Название возрастной категории в зависимости от возраста участника и категорий в заезде.
      const categoryAge = await this.getAgeCategory(dataDeserialized, race.categories);

      // Если название Возрастная, значит SkillLevel: null
      const categorySkillLevel =
        dataDeserialized.categoryName === DEFAULT_AGE_NAME_CATEGORY
          ? null
          : dataDeserialized.categoryName;

      // Сохранение в БД результата райдера в Заезде Чемпионата.
      const createdResponse = await ResultRaceModel.create({
        championship: dataDeserialized.championshipId,
        race: dataDeserialized.raceId,
        startNumber: dataDeserialized.startNumber,
        ...(riderDB && { rider: riderDB._id }),
        ...(dataDeserialized.disqualification && {
          disqualification: dataDeserialized.disqualification,
        }),
        profile: {
          firstName: dataDeserialized.firstName,
          lastName: dataDeserialized.lastName,
          ...(dataDeserialized.patronymic && { patronymic: dataDeserialized.patronymic }),
          ...(dataDeserialized.team && { team: dataDeserialized.team }),
          city: dataDeserialized.city,
          yearBirthday: dataDeserialized.yearBirthday,
          gender: dataDeserialized.gender,
        },
        categoryAge,
        ...(dataDeserialized.id && { id: dataDeserialized.id }),
        raceTimeInMilliseconds: dataDeserialized.timeDetailsInMilliseconds,
        categorySkillLevel,
        creator: creatorId,
      });

      await this.updateRaceProtocol({
        championshipId: dataDeserialized.championshipId,
        raceId: dataDeserialized.raceId,
      });

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: creatorId,
        changes: {
          description: `Создание результата для заезда с _id: "${createdResponse.race.toString()}"`,
          params: {
            dataFromFormSerialized: {
              description: 'Данные в формате FormData для создания организатора',
              dataDeserialized,
            },
            creatorId,
          },
        },
        action: 'create',
        entity: this.entity,
        entityIds: [createdResponse._id.toString()],
      });

      return {
        data: null,
        ok: true,
        message: `Результат райдера "${dataDeserialized.lastName} ${dataDeserialized.firstName}" добавлен в финишный протокол.`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновление данных результата.
   */
  public async update({
    result,
    moderator,
  }: {
    result: FormData;
    moderator: string;
  }): Promise<ServerResponse<null>> {
    try {
      // Данные после десериализации.
      const dataDeserialized = deserializationResultRaceRider(result);

      // Получение обновляемого результата.
      const resultDB: TResultRaceDocument | null = await ResultRaceModel.findOne({
        _id: dataDeserialized.resultId,
      });

      if (!resultDB) {
        throw new Error(`Не найден обновляемый результат с _id:${dataDeserialized.resultId}`);
      }

      // Проверка занят или нет стартовый номер у райдера, результат которого вносится в протокол.
      await this.isStartNumberTaken(dataDeserialized);

      // Если название Возрастная, значит SkillLevel: null
      const categorySkillLevel =
        dataDeserialized.categoryName === DEFAULT_AGE_NAME_CATEGORY
          ? null
          : dataDeserialized.categoryName;

      // Данные по заезду.
      const race = await this.getRace(resultDB.race._id.toString());
      // Название возрастной категории в зависимости от возраста участника и категорий в заезде.
      const categoryAge = await this.getAgeCategory(dataDeserialized, race.categories);

      const query = {
        profile: {
          firstName: dataDeserialized.firstName,
          lastName: dataDeserialized.lastName,
          patronymic: dataDeserialized.patronymic || null,
          team: dataDeserialized.team || null,
          city: dataDeserialized.city,
          yearBirthday: dataDeserialized.yearBirthday,
          gender: dataDeserialized.gender,
        },
        categorySkillLevel,
        categoryAge,
        startNumber: dataDeserialized.startNumber,
        raceTimeInMilliseconds: dataDeserialized.timeDetailsInMilliseconds,
      };

      const updateResult = await resultDB.updateOne({ $set: query });

      // Обновление позиций, отставаний, средней скорости, возрастных категорий в протоколе.
      await this.updateRaceProtocol({
        championshipId: String(resultDB.championship),
        raceId: resultDB.race.toString(),
      });

      const success = updateResult.modifiedCount > 0;

      if (success) {
        await ModeratorActionLogService.create({
          moderator,
          changes: {
            description: `Изменение данных результата райдера в финишном протоколе заезда с _id: "${race.toString()}"`,
            params: {
              result: {
                description: 'Формат FormData. Десериализованные данные в следующем свойстве',
                dataDeserialized,
              },
              moderator,
            },
          },
          action: 'update',
          entity: this.entity,
          entityIds: [resultDB._id.toString()],
        });
      }

      return {
        data: null,
        ok: success,
        message: success
          ? 'Обновлены данные результата райдера в протоколе'
          : `Неизвестная ошибка при обновлении результата с _id:${dataDeserialized.resultId}`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение протокола заезда чемпионата.
   */
  public async getRaceProtocol({
    raceId,
  }: {
    raceId: string;
  }): Promise<ServerResponse<TProtocolRace | null>> {
    try {
      // Проверка наличия Заезда Чемпионата в БД.
      const race = await this.getRace(raceId);

      // Получение результатов заезда raceId в чемпионате championshipId.
      const resultsRaceDB = await ResultRaceModel.find(
        { race: raceId },
        { 'positions._id': false }
      )
        .populate({
          path: 'rider',
          select: ['id', 'image', 'imageFromProvider', 'provider.image', '-_id'],
        })
        .lean<TResultRaceFromDB[]>();

      // Подготовка данных для клиента.
      const resultsAfterDto = dtoResultsRace(resultsRaceDB);

      // Сортируем по времени заезда.
      const resultsSorted = resultsAfterDto.sort(
        (a, b) => a.raceTimeInMilliseconds - b.raceTimeInMilliseconds
      );

      // Создание списка всех категорий в заезде (категории без результатов не учитываются).
      const existCategoryNames = getExistCategoryNames(resultsSorted);

      return {
        data: {
          protocol: resultsSorted,
          categories: existCategoryNames,
          race: { name: race.name, _id: raceId },
        },
        ok: true,
        message: 'Протокол заезда Чемпионата',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновляет протокол заезда, включая расчет и установку мест в категориях, а также обновление данных в базе.
   *
   * @param {Object} params - Параметры для обновления протокола заезда.
   * @param {string} params.championshipId - Идентификатор чемпионата.
   * @param {number} params.raceNumber - Номер заезда.
   * @returns {Promise<ServerResponse<null>>} Результат выполнения операции.
   */
  public async updateRaceProtocol({
    championshipId,
    raceId,
    moderator,
  }: {
    championshipId: string;
    raceId: string;
    moderator?: string;
  }): Promise<ServerResponse<null>> {
    try {
      // Получение данных заезда.
      const race = await this.getRace(raceId);

      // Получение результатов заезда.
      const resultsRaceDB = await this.getResultsRace(raceId);

      // Получение категорий заезда.
      const categoriesDB = await this.getRaceCategories({
        championshipId,
        categoriesId: race.categories,
        raceId,
      });

      // Обработка данных.
      const { validResults, dsqResults, quantityRidersFinished } = processResults({
        results: resultsRaceDB,
        categories: categoriesDB,
        raceDistance: race.distance,
      });

      // Получение очков за этап в серии заездов или туре.
      await this.setPoints({ championshipId, results: validResults });

      // Обновление позиций и прочих данных.
      await this.updateResults([...validResults, ...dsqResults]);

      // Обновление количества участников в коллекции Чемпионат в соответствующем заезде.
      await this.updateQuantityFinishedRiders({ raceId, quantityRidersFinished });

      // Логирование действия, запущенного напрямую из клиента. Не логируется, если метод запущен из других методов данного класса (не передается moderator).
      if (moderator) {
        await ModeratorActionLogService.create({
          moderator,
          changes: {
            description: `Пересчет данных и обновление финишного протокола заезда с _id: "${race.toString()}"`,
            params: {
              championshipId,
              raceId,
              moderator,
            },
          },
          action: 'update',
          entity: this.entity,
          entityIds: [],
        });
      }

      return {
        data: null,
        ok: true,
        message:
          'Обновлены возрастные категории и места во всех категориях финишного протокола!',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Установка очков в результат райдера в зависимости от его места.
   */
  private async setPoints({ championshipId, results }: TRaceResultsServiceSetPointsParams) {
    const championshipDB = await ChampionshipModel.findById(championshipId, {
      _id: false,
      type: true,
      parentChampionship: true,
    }).lean<{ type: TChampionshipTypes; parentChampionship: Types.ObjectId | null }>();

    // Очки начисляются в результаты этапа stage .
    if (!championshipDB || championshipDB.type !== 'stage') {
      return;
    }

    if (!championshipDB.parentChampionship) {
      throw new Error('Не найден родительский чемпионат для данного Этапа!');
    }

    const parentChampionshipDB = await ChampionshipModel.findById(
      championshipDB.parentChampionship,
      {
        _id: false,
        racePointsTable: true,
      }
    )
      .populate('racePointsTable')
      .lean<{ racePointsTable: TRacePointsTable }>();

    if (!parentChampionshipDB?.racePointsTable) {
      throw new Error('Нет таблицы начисления очков за этап в настройках чемпионата!');
    }

    for (const result of results) {
      // Обнуление очков.
      result.points = { category: 0, absolute: 0, absoluteGender: 0 };

      const { rules, fallbackPoints } = parentChampionshipDB.racePointsTable;

      const pointFields = ['category', 'absolute', 'absoluteGender'] as const;

      for (const field of pointFields) {
        result.points[field] =
          rules.find((rule) => rule.place === result.positions[field])?.points ??
          fallbackPoints ??
          0;
      }
    }
  }

  /**
   *
   */
  private async updateQuantityFinishedRiders({
    raceId,
    quantityRidersFinished,
  }: {
    raceId: string;
    quantityRidersFinished: number;
  }): Promise<ServerResponse<null>> {
    try {
      await RaceModel.findOneAndUpdate({ _id: raceId }, { $set: { quantityRidersFinished } });

      return {
        data: null,
        ok: true,
        message: 'Обновлены данные по количеству финишировавших райдеров в заезде!',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получает данные заезда по идентификатору чемпионата и номеру заезда.
   *
   * @param {string} raceId - Идентификатор заезда.
   * @returns {Promise<TRace | null>} Данные заезда или null, если заезд не найден.
   */
  private async getRace(raceId: string): Promise<TRace> {
    const raceDB = await RaceModel.findOne({ _id: raceId }).lean<TRace>();

    if (!raceDB) {
      throw new Error(`Не найден заезд с _id:${raceId}!`);
    }

    return raceDB;
  }

  /**
   * Получает результаты заезда по идентификатору чемпионата и номеру заезда.
   *
   * @param {string} raceId - Идентификатор заезда.
   * @returns {Promise<TResultRace[]>} Массив результатов заезда.
   */
  private async getResultsRace(raceId: string): Promise<TResultRace[]> {
    return ResultRaceModel.find({ race: raceId }).lean<TResultRace[]>();
  }

  /**
   * Обновляет результаты с добавленными местами, очками, средней скоростью, отставаниями в базе данных.
   *
   * @param {TResultRaceDocument[]} results - Массив результатов заезда.
   * @returns {Promise<void>} Обещание, которое разрешается, когда обновление завершено.
   */
  private async updateResults(results: TResultRace[]): Promise<void> {
    await Promise.all(
      results.map((result) =>
        ResultRaceModel.updateOne(
          { _id: result._id },
          {
            $set: {
              'positions.absolute': result.positions.absolute,
              'positions.absoluteGender': result.positions.absoluteGender,
              'positions.category': result.positions.category,
              points: result.points,
              quantityRidersFinished: result.quantityRidersFinished,
              averageSpeed: result.averageSpeed,
              categoryAge: result.categoryAge,
              gapsInCategories: result.gapsInCategories,
            },
          }
        )
      )
    );
  }

  /**
   * Удаление результата.
   */
  public async delete({
    _id,
    moderator,
  }: {
    _id: string;
    moderator: string;
  }): Promise<ServerResponse<null>> {
    try {
      // Получение данных заезда.
      const resultDB = await ResultRaceModel.findOneAndDelete({ _id }, { profile: true });

      if (!resultDB) {
        throw new Error(`Не найден запрашиваемый результат с _id:${_id}`);
      }

      // Обновление протокола после удаления результата.
      await this.updateRaceProtocol({
        championshipId: resultDB.championship.toString(),
        raceId: resultDB.race.toString(),
      });

      await ModeratorActionLogService.create({
        moderator,
        changes: {
          description: `Удален результат райдера _id: ${resultDB._id.toString()} в заезде с _id: "${resultDB.race.toString()}"`,
          params: {
            _id,
            moderator,
          },
        },
        action: 'delete',
        entity: this.entity,
        entityIds: [resultDB._id.toString()],
      });

      return {
        data: null,
        ok: true,
        message: `Результат райдера ${resultDB.profile.lastName}${resultDB.profile.firstName} - удалён!`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Проверка входных данных с клиента для создание финишного результата райдера в заезде.
   */
  private validateRaceResultData(data: TResultRaceRiderDeserialized) {
    if (!data.lastName) {
      throw new Error('Отсутствует фамилия');
    } else if (!data.firstName) {
      throw new Error('Отсутствует имя');
    } else if (!data.yearBirthday || +data.yearBirthday === 0) {
      throw new Error('Отсутствует год рождения');
    } else if (!data.timeDetailsInMilliseconds) {
      throw new Error('Отсутствует финишное время');
    }
  }

  /**
   * Проверка на наличие результата райдера в протоколе.
   * Проверка осуществляется только среди зарегистрированных пользователей на сайте.
   */
  private async isRiderResultExists(
    data: TResultRaceRiderDeserialized,
    raceName: string
  ): Promise<void> {
    // Если data._id = undefined значит райдер не зарегистрирован на сайте.
    if (!data._id) {
      return;
    }

    const resultRaceDB = await ResultRaceModel.findOne(
      {
        rider: data._id,
        championship: data.championshipId,
        race: data.raceId,
      },
      { _id: true }
    ).lean<{ _id: Types.ObjectId }>();

    if (resultRaceDB) {
      throw new Error(
        `Результат райдера bcId:${data.id} существует в протоколе заезда ${raceName}`
      );
    }
  }

  /**
   * Проверка занят или нет стартовый номер у райдера, результат которого вносится в протокол.
   */
  private async isStartNumberTaken(data: TResultRaceRiderDeserialized) {
    const res = await ResultRaceModel.findOne(
      {
        championship: data.championshipId,
        race: data.raceId,
        startNumber: data.startNumber,
      },
      { rider: true, 'profile.lastName': true, 'profile.firstName': true }
    )
      .populate({ path: 'rider', select: ['id'] })
      .lean<{
        _id: Types.ObjectId;
        profile: { lastName: string; firstName: string };
        rider: { id: number } | undefined;
      }>();

    // Проверка  (res.rider?.id && res.rider.id !== data.id) что номер принадлежит не райдеру которому изменяется результат.
    if (res && res.rider?.id && res.rider.id !== data.id) {
      throw new Error(
        `Данный стартовый номер: ${data.startNumber} уже есть в протоколе у райдера: ${res.profile.lastName} ${res.profile.firstName}`
      );
    }
  }

  /**
   * Получение категорий для заезда raceId чемпионата championshipId.
   */
  private async getRaceCategories({
    championshipId,
    categoriesId,
    raceId,
  }: TGetRaceCategoriesParams): Promise<TGetRaceCategoriesFromMongo> {
    const categoriesDB = await CategoriesModel.findOne(
      { _id: categoriesId },
      { age: true, skillLevel: true, _id: false }
    ).lean<TGetRaceCategoriesFromMongo>();

    if (!categoriesDB) {
      throw new Error(
        `Не найден пакет категорий для чемпионата _id: ${championshipId} и заезда _id: ${raceId}`
      );
    }
    return categoriesDB;
  }

  /**
   * Получение возрастной категории в зависимости от возраста участника и от категорий в заезде.
   */
  public async getAgeCategory(
    data: TResultRaceRiderDeserialized,
    categoriesId: Types.ObjectId
  ) {
    const categoriesDB = await this.getRaceCategories({
      championshipId: data.championshipId,
      categoriesId,
      raceId: data.raceId,
    });

    // Присвоение возрастной категории
    const { male: categoriesAgeMale, female: categoriesAgeFemale } = categoriesDB.age;
    const isFemale = data.gender === 'female';

    // Создание название возрастной категории на основании возрастных рамок в которые попадает райдер.
    // skillLevel категория приходит из клиента. Получения из регистрации или в процессе добавления результата.
    return createStringCategoryAge({
      yearBirthday: data.yearBirthday,
      categoriesAge: isFemale ? categoriesAgeFemale : categoriesAgeMale,
      gender: isFemale ? 'female' : 'male',
    });
  }
}
