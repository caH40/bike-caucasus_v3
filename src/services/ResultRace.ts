import { ObjectId } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { deserializationResultRaceRider } from '@/libs/utils/deserialization/resultRaceRider';
import { ResultRaceModel } from '@/database/mongodb/Models/ResultRace';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { User as UserModel } from '@/database/mongodb/Models/User';
import { dtoResultsRace, dtoResultsRaceRider } from '@/dto/results-race';
import {
  ResponseServer,
  TResultRaceFromDB,
  TResultRaceRideFromDB,
} from '@/types/index.interface';
import { TResultRaceDto, TResultRaceRiderDto } from '@/types/dto.types';
import { getCategoryAge } from '@/libs/utils/age-category';
import { TRace, TResultRaceDocument } from '@/types/models.interface';
import { sortCategoriesString } from '@/libs/utils/championship';
import { processResults } from '@/libs/results';

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

  public async getOne(): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      return { data: null, ok: true, message: 'Данные заезда Чемпионата' };
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

      const resultsDB: TResultRaceRideFromDB[] = await ResultRaceModel.find(
        { rider: userDB._id },
        { _id: false, createdAt: false, updatedAt: false, creator: false }
      )
        .populate({ path: 'championship', select: ['name', 'urlSlug', 'races', 'endDate'] })
        .lean();

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

      // Проверка существования Чемпионата с нужным заездом.
      const champDB = await ChampionshipModel.findOne(
        {
          _id: dataDeserialized.championshipId,
          'races.number': dataDeserialized.raceNumber,
        },
        { races: { $elemMatch: { number: dataDeserialized.raceNumber } }, name: true }
      ).lean();

      if (!champDB) {
        throw new Error(
          `Не найден чемпионат с _id:${dataDeserialized.championshipId} и заездом №${dataDeserialized.raceNumber} для добавления финишного результата!`
        );
      }

      // Проверка дублирование результата Райдера в Чемпионате заезда.
      // Проверка по id пользователя на сайте.
      let resultRaceDB = {} as { _id: ObjectId } | null;

      if (dataDeserialized._id) {
        resultRaceDB = await ResultRaceModel.findOne(
          {
            rider: dataDeserialized._id,
            championship: dataDeserialized.championshipId,
            raceNumber: dataDeserialized.raceNumber,
          },
          { _id: true }
        ).lean();
      }

      if (resultRaceDB?._id) {
        throw new Error(
          `Результат райдера bcId:${dataDeserialized.id} существует в протоколе заезда №${dataDeserialized.raceNumber} "${champDB.name}"`
        );
      }

      // Проверка занят или нет стартовый номер у райдера, результат которого вносится в протокол.
      const registrationDB: { profile: { lastName: string; firstName: string } } | null =
        await ResultRaceModel.findOne(
          {
            championship: dataDeserialized.championshipId,
            raceNumber: dataDeserialized.raceNumber,
            startNumber: dataDeserialized.startNumber,
          },
          { 'profile.lastName': true, 'profile.firstName': true }
        ).lean();

      let riderDB = {} as { _id: ObjectId } | null;
      if (dataDeserialized.id) {
        riderDB = await UserModel.findOne({ id: dataDeserialized.id }, { _id: true }).lean();
      }

      if (registrationDB) {
        throw new Error(
          `Данный стартовый номер: ${dataDeserialized.startNumber} уже есть в протоколе у райдера: ${registrationDB.profile.lastName} ${registrationDB.profile.firstName}`
        );
      }

      // Присвоение возрастной категории
      const categoriesAgeMale = champDB.races[0].categoriesAgeMale;
      const categoriesAgeFemale = champDB.races[0].categoriesAgeFemale;
      const isFemale = dataDeserialized.gender === 'female';

      const categoryAge = getCategoryAge({
        yearBirthday: dataDeserialized.yearBirthday,
        categoriesAge: isFemale ? categoriesAgeFemale : categoriesAgeMale,
        gender: isFemale ? 'F' : 'M',
      });

      // Сохранение в БД результата райдера в Заезде Чемпионата.
      await ResultRaceModel.create({
        championship: dataDeserialized.championshipId,
        raceNumber: dataDeserialized.raceNumber,
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
        raceNumber: dataDeserialized.raceNumber,
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
    championshipId,
    raceNumber,
  }: {
    championshipId: string;
    raceNumber: number;
  }): Promise<ResponseServer<{ protocol: TResultRaceDto[]; categories: string[] } | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Проверка наличия Заезда Чемпионата в БД.
      const champDB = await ChampionshipModel.findOne(
        {
          _id: championshipId,
          'races.number': raceNumber,
        },
        { _id: true, name: true }
      ).lean();

      if (!champDB) {
        throw new Error(
          `Не найден чемпионат с _id:${championshipId} и заездом №${raceNumber} для добавления финишного результата!`
        );
      }

      // Получение результатов заезда raceNumber в чемпионате championshipId.
      const resultsRaceDB: TResultRaceFromDB[] = await ResultRaceModel.find(
        {
          championship: championshipId,
          raceNumber,
        },
        { 'positions._id': false }
      )
        .populate({
          path: 'rider',
          select: ['id', 'image', 'imageFromProvider', 'provider.image', '-_id'],
        })
        .lean();

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
        data: { protocol: resultsSorted, categories: categoriesSorted },
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
    raceNumber,
  }: {
    championshipId: string;
    raceNumber: number;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Получение данных заезда.
      const race = await this.getRace(championshipId, raceNumber);

      // Получение результатов заезда.
      const resultsRaceDB = await this.getResultsRace(championshipId, raceNumber);

      // Обработка данных.
      const { resultsUpdated } = processResults({
        results: resultsRaceDB,
        race,
      });

      // Обновление позиций и прочих данных.
      await this.updateResults(resultsUpdated);

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
   * Получает данные заезда по идентификатору чемпионата и номеру заезда.
   *
   * @param {string} championshipId - Идентификатор чемпионата.
   * @param {number} raceNumber - Номер заезда.
   * @returns {Promise<TRace | null>} Данные заезда или null, если заезд не найден.
   */
  private async getRace(championshipId: string, raceNumber: number): Promise<TRace> {
    const racesInChampDB = await ChampionshipModel.findOne(
      { _id: championshipId, 'races.number': raceNumber },
      { races: { $elemMatch: { number: raceNumber } } }
    ).lean();

    const race = racesInChampDB?.races[0];

    if (!race) {
      throw new Error(`Не найден чемпионат с _id:${championshipId} и заездом №${raceNumber}`);
    }

    return race;
  }

  /**
   * Получает результаты заезда по идентификатору чемпионата и номеру заезда.
   *
   * @param {string} championshipId - Идентификатор чемпионата.
   * @param {number} raceNumber - Номер заезда.
   * @returns {Promise<TResultRaceDocument[]>} Массив результатов заезда.
   */
  private async getResultsRace(
    championshipId: string,
    raceNumber: number
  ): Promise<TResultRaceDocument[]> {
    return ResultRaceModel.find({ championship: championshipId, raceNumber }).lean();
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
              // categorySkillLevel: result.categorySkillLevel,
            },
          }
        )
      )
    );
  }
}
