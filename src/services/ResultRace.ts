import { ObjectId } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { deserializationResultRaceRider } from '@/libs/utils/deserialization/resultRaceRider';
import { ResultRaceModel } from '@/database/mongodb/Models/ResultRace';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { User as UserModel } from '@/database/mongodb/Models/User';
import { dtoResultsRace } from '@/dto/results-race';
import { ResponseServer, TResultRaceFromDB } from '@/types/index.interface';
import { TResultRaceDto } from '@/types/dto.types';
import { getCategoryAge } from '@/libs/utils/age-category';

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
  }): Promise<ResponseServer<TResultRaceDto[] | null>> {
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
      const resultsRaceDB: TResultRaceFromDB[] = await ResultRaceModel.find({
        championship: championshipId,
        raceNumber,
      })
        .populate({
          path: 'rider',
          select: ['id', 'image', 'imageFromProvider', 'provider.image', '-_id'],
        })
        .lean();

      const resultsAfterDto = dtoResultsRace(resultsRaceDB);

      return { data: resultsAfterDto, ok: true, message: 'Протокол заезда Чемпионата' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновление финишного протокола заезда чемпионата.
   * Распределяются места в каждой возрастной категории и в абсолюте.
   */
  // private async updateProtocolRace({
  //   championshipId,
  //   raceNumber,
  //   results,
  // }: {
  //   championshipId: string;
  //   raceNumber: number;
  //   results: TResultRaceDto[];
  // }): Promise<TResultRaceDto[] | null> {
  //   try {
  //     // Подключение к БД.
  //     await this.dbConnection();

  //     // Проверка и получение данных Заезда Чемпионата.
  //     const racesInChampDB: { races: TRace[] } | null = await ChampionshipModel.findOne(
  //       {
  //         _id: championshipId,
  //         'races.number': raceNumber,
  //       },
  //       { races: { $elemMatch: { number: raceNumber } } }
  //     ).lean();

  //     // Данные обрабатываемого заезда.
  //     const race = racesInChampDB?.races[0];
  //     if (race?.number !== raceNumber) {
  //       throw new Error(
  //         ` Не найден чемпионат с _id:${championshipId} и заездом №${raceNumber}`
  //       );
  //     }

  //     const resultsRaceDB: TResultRaceDocument[] = await ResultRaceModel.find({
  //       championship: championshipId,
  //       raceNumber,
  //     });

  //     for (const result of resultsRaceDB) {
  //       if (result.profile.gender === 'female') {
  //         // Обновление результатов для женских категорий.
  //         race.categoriesAgeFemale;
  //       } else if (result.profile.gender === 'male') {
  //         // Обновление результатов для мужских категорий.
  //       }
  //     }

  //     return results;
  //   } catch (error) {
  //     this.errorLogger(error);
  //     return null;
  //   }
  // }
}
