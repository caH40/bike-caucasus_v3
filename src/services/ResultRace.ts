import { ObjectId } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { deserializationResultRaceRider } from '@/libs/utils/deserialization/resultRaceRider';
import { ResultRaceModel } from '@/database/mongodb/Models/ResultRace';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { User as UserModel } from '@/database/mongodb/Models/User';
import { dtoResultsRace, dtoResultsRaceRider, dtoResultRaceRider } from '@/dto/results-race';
import {
  ResponseServer,
  TGetRaceCategoriesParams,
  TProtocolRace,
  TResultRaceFromDB,
  TResultRaceRideFromDB,
} from '@/types/index.interface';
import { TResultRaceRiderDto } from '@/types/dto.types';
import { createStringCategoryAge } from '@/libs/utils/age-category';
import { TRace, TResultRace, TResultRaceDocument } from '@/types/models.interface';
import { sortCategoriesString } from '@/libs/utils/championship';
import { processResults } from '@/libs/utils/results';
import { CategoriesModel } from '@/database/mongodb/Models/Categories';
import { TGetRaceCategoriesFromMongo } from '@/types/mongo.types';
import { RaceModel } from '@/database/mongodb/Models/Race';

/**
 * Сервис работы с результатами заезда Чемпионата.
 */
export class ResultRaceService {
  private errorLogger;
  private handlerErrorDB;
  private dbConnection: () => Promise<void>;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.dbConnection = connectToMongo;
  }

  public async getOne({
    resultId,
  }: {
    resultId: string;
  }): Promise<ResponseServer<TResultRaceRiderDto | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const resultDB = await ResultRaceModel.findOne(
        { _id: resultId },
        { createdAt: false, updatedAt: false, creator: false }
      )
        .populate({ path: 'championship', select: ['name', 'urlSlug', 'races', 'endDate'] })
        .lean<TResultRaceRideFromDB>();

      if (!resultDB) {
        throw new Error('Не найден обновляемый результат в БД!');
      }

      const resultsRaceRiderAfterDto = dtoResultRaceRider(resultDB);

      return { data: resultsRaceRiderAfterDto, ok: true, message: 'Данные заезда Чемпионата' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение результатов райдера по riderId.
   */
  public async getForRider({
    riderId,
  }: {
    riderId: string;
  }): Promise<ResponseServer<TResultRaceRiderDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const userDB = await UserModel.findOne({ id: riderId }, { _id: true });

      if (!userDB) {
        throw new Error(`Не найден пользователь с id: ${riderId} в БД!`);
      }

      const resultsDB = await ResultRaceModel.find(
        { rider: userDB._id },
        { createdAt: false, updatedAt: false, creator: false }
      )
        .populate({ path: 'championship', select: ['name', 'urlSlug', 'races', 'endDate'] })
        .lean<TResultRaceRideFromDB[]>();

      const resultsRaceRiderAfterDto = dtoResultsRaceRider(resultsDB);

      return { data: resultsRaceRiderAfterDto, ok: true, message: 'Данные заезда Чемпионата' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Добавление результата райдера в Заезде Чемпионата в протокол.
   */
  public async post({
    dataFromFormSerialized,
    creatorId,
  }: {
    dataFromFormSerialized: FormData;
    creatorId: string;
  }): Promise<ResponseServer<null>> {
    try {
      const dataDeserialized = deserializationResultRaceRider(dataFromFormSerialized);

      if (!dataDeserialized.lastName) {
        throw new Error('Отсутствует фамилия');
      } else if (!dataDeserialized.firstName) {
        throw new Error('Отсутствует имя');
      } else if (!dataDeserialized.yearBirthday || +dataDeserialized.yearBirthday === 0) {
        throw new Error('Отсутствует год рождения');
      } else if (!dataDeserialized.timeDetailsInMilliseconds) {
        throw new Error('Отсутствует финишное время');
      }

      // Подключение к БД.
      await this.dbConnection();

      // Проверка дублирование результата Райдера в Чемпионате заезда.
      // Проверка по id пользователя на сайте.
      let resultRaceDB = {} as { _id: ObjectId } | null;

      if (dataDeserialized._id) {
        resultRaceDB = await ResultRaceModel.findOne(
          {
            rider: dataDeserialized._id,
            championship: dataDeserialized.championshipId,
            raceId: dataDeserialized.raceId,
          },
          { _id: true }
        ).lean<{ _id: ObjectId }>();
      }

      const race = await this.getRace(dataDeserialized.raceId);

      if (resultRaceDB?._id) {
        throw new Error(
          `Результат райдера bcId:${dataDeserialized.id} существует в протоколе заезда ${race.name}`
        );
      }

      // Проверка занят или нет стартовый номер у райдера, результат которого вносится в протокол.
      const registrationDB: { profile: { lastName: string; firstName: string } } | null =
        await ResultRaceModel.findOne(
          {
            championship: dataDeserialized.championshipId,
            raceNumber: dataDeserialized.raceId,
            startNumber: dataDeserialized.startNumber,
          },
          { 'profile.lastName': true, 'profile.firstName': true }
        ).lean();

      let riderDB = {} as { _id: ObjectId } | null;
      if (dataDeserialized.id) {
        riderDB = await UserModel.findOne({ id: dataDeserialized.id }, { _id: true }).lean<{
          _id: ObjectId;
        }>();
      }

      if (registrationDB) {
        throw new Error(
          `Данный стартовый номер: ${dataDeserialized.startNumber} уже есть в протоколе у райдера: ${registrationDB.profile.lastName} ${registrationDB.profile.firstName}`
        );
      }

      const categoriesDB = await this.getRaceCategories({
        championshipId: dataDeserialized.championshipId,
        categoriesId: champDB.races[0].categories,
        raceNumber: dataDeserialized.raceNumber,
      });

      // Присвоение возрастной категории
      const categoriesAgeMale = categoriesDB.age.male;
      const categoriesAgeFemale = categoriesDB.age.female;
      const isFemale = dataDeserialized.gender === 'female';

      // Создание название возрастной категории на основании возрастных рамок в которые попадает райдер.
      const categoryAge = createStringCategoryAge({
        yearBirthday: dataDeserialized.yearBirthday,
        categoriesAge: isFemale ? categoriesAgeFemale : categoriesAgeMale,
        gender: isFemale ? 'F' : 'M',
      });

      // Сохранение в БД результата райдера в Заезде Чемпионата.
      await ResultRaceModel.create({
        championship: dataDeserialized.championshipId,
        race: dataDeserialized.raceId,
        startNumber: dataDeserialized.startNumber,
        ...(riderDB && { rider: riderDB._id }),
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
        creator: creatorId,
      });

      await this.updateProtocolRace({
        championshipId: dataDeserialized.championshipId,
        raceId: dataDeserialized.raceId,
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
   * Получение протокола заезда чемпионата.
   */
  public async getProtocolRace({
    raceId,
  }: {
    raceId: string;
  }): Promise<ResponseServer<TProtocolRace | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Проверка наличия Заезда Чемпионата в БД.
      const race = await this.getRace(raceId);

      // Получение результатов заезда raceNumber в чемпионате championshipId.
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
      const categoriesSet = new Set<string>();
      for (const result of resultsAfterDto) {
        categoriesSet.add(result.categoryAge);
      }

      // Сортируем категории по возрастанию года рождения.
      const categoriesSorted = sortCategoriesString([...categoriesSet]);

      return {
        data: {
          protocol: resultsSorted,
          categories: categoriesSorted,
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
   * @returns {Promise<ResponseServer<null>>} Результат выполнения операции.
   */
  public async updateProtocolRace({
    championshipId,
    raceId,
  }: {
    championshipId: string;
    raceId: string;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Получение данных заезда.
      const race = await this.getRace(raceId);

      // Получение результатов заезда.
      const resultsRaceDB = await this.getResultsRace(raceId);

      // Получение категорий заезда.
      const categoriesDB = await this.getRaceCategories({
        championshipId,
        categoriesId: race.categories,
        raceNumber,
      });

      // Обработка данных.
      const { resultsUpdated, quantityRidersFinished } = processResults({
        results: resultsRaceDB,
        categories: categoriesDB,
        raceDistance: race.distance,
      });

      // Обновление позиций и прочих данных.
      await this.updateResults(resultsUpdated);

      // Обновление количества участников в коллекции Чемпионат в соответствующем заезде.
      await this.updateQuantityFinishedRiders({
        championshipId,
        raceNumber,
        quantityRidersFinished,
      });

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
   *
   */
  private async updateQuantityFinishedRiders({
    championshipId,
    raceNumber,
    quantityRidersFinished,
  }: {
    championshipId: string;
    raceNumber: number;
    quantityRidersFinished: number;
  }): Promise<ResponseServer<null>> {
    try {
      await ChampionshipModel.findOneAndUpdate(
        { _id: championshipId, 'races.number': raceNumber },
        // По фильтру 'races.number': raceNumber обновляет соответствующий элемент массива races
        { $set: { 'races.$.quantityRidersFinished': quantityRidersFinished } }
      );

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
   * Обновляет результаты в базе данных.
   *
   * @param {TResultRaceDocument[]} results - Массив результатов заезда.
   * @returns {Promise<void>} Обещание, которое разрешается, когда обновление завершено.
   */
  private async updateResults(results: TResultRaceDocument[]): Promise<void> {
    await Promise.all(
      results.map((result) =>
        ResultRaceModel.updateOne(
          { _id: result._id },
          {
            $set: {
              'positions.absolute': result.positions.absolute,
              'positions.absoluteGender': result.positions.absoluteGender,
              'positions.category': result.positions.category,
              quantityRidersFinished: result.quantityRidersFinished,
              averageSpeed: result.averageSpeed,
              categoryAge: result.categoryAge,
              gapsInCategories: result.gapsInCategories,
              // categorySkillLevel: result.categorySkillLevel,
            },
          }
        )
      )
    );
  }

  /**
   * Удаление результата.
   */
  public async delete({ _id }: { _id: string }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Получение данных заезда.
      const resultDB = await ResultRaceModel.findOneAndDelete({ _id }, { profile: true });
      if (resultDB) {
        return {
          data: null,
          ok: true,
          message: `Результат райдера ${resultDB.profile.lastName}${resultDB.profile.firstName} - удалён!`,
        };
      } else {
        return {
          data: null,
          ok: false,
          message: `Не найден запрашиваемый результат с _id:${_id}`,
        };
      }
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновление данных результата.
   */
  public async update({ result }: { result: FormData }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Данные после десериализации.
      const dataDeserialized = deserializationResultRaceRider(result);

      // Получение обновляемого результата.
      const resultDB = await ResultRaceModel.findOne({ _id: dataDeserialized.resultId });

      if (!resultDB) {
        throw new Error(`Не найден обновляемый результат с _id:${dataDeserialized.resultId}`);
      }

      // Проверка занят или нет стартовый номер у райдера, результат которого вносится в протокол.
      const checkNumberDB = await ResultRaceModel.findOne(
        {
          championship: resultDB.championship,
          raceNumber: resultDB.raceNumber,
          startNumber: dataDeserialized.startNumber,
        },
        { 'profile.lastName': true, 'profile.firstName': true }
      ).lean<{
        _id: ObjectId;
        profile: { lastName: string; firstName: string };
      }>();

      // Проверка String(registrationDB._id) !== dataDeserialized._id) что номер принадлежит не райдеру которому изменяется результат.
      if (checkNumberDB && String(checkNumberDB._id) !== dataDeserialized.resultId) {
        throw new Error(
          `Данный стартовый номер: ${dataDeserialized.startNumber} уже есть в протоколе у райдера: ${checkNumberDB.profile.lastName} ${checkNumberDB.profile.firstName}`
        );
      }

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
        startNumber: dataDeserialized.startNumber,
        raceTimeInMilliseconds: dataDeserialized.timeDetailsInMilliseconds,
      };

      const updateResult = await resultDB.updateOne({ $set: query });

      // Обновление позиций, отставаний, средней скорости, возрастных категорий в протоколе.
      await this.updateProtocolRace({
        championshipId: String(resultDB.championship),
        raceNumber: resultDB.raceNumber,
      });

      const success = updateResult.modifiedCount > 0;
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
   * Получение категорий для заезда raceNumber чемпионата championshipId.
   */
  private async getRaceCategories({
    championshipId,
    categoriesId,
    raceNumber,
  }: TGetRaceCategoriesParams): Promise<TGetRaceCategoriesFromMongo> {
    const categoriesDB = await CategoriesModel.findOne(
      { _id: categoriesId },
      { age: true, skillLevel: true, _id: false }
    ).lean<TGetRaceCategoriesFromMongo>();

    if (!categoriesDB) {
      throw new Error(
        `Не найден пакет категорий для чемпионата ${championshipId} и заезда №${raceNumber}`
      );
    }
    return categoriesDB;
  }
}
