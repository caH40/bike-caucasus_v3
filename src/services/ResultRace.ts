import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { ResponseServer } from '@/types/index.interface';
import { deserializationResultRaceRider } from '@/libs/utils/deserialization/resultRaceRider';
import { ResultRaceModel } from '@/database/mongodb/Models/ResultRace';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { ObjectId } from 'mongoose';

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
        { _id: true, name: true }
      ).lean();

      if (!champDB) {
        throw new Error(
          `Не найден чемпионат с _id:${dataDeserialized.championshipId} и заездом №${dataDeserialized.raceNumber} для добавления финишного результата!`
        );
      }

      // Проверка дублирование результата Райдера в Чемпионате заезда.
      // Проверка по id пользователя на сайте.
      let resultRaceDB = {} as { _id: ObjectId } | null;

      if (dataDeserialized.id) {
        resultRaceDB = await ResultRaceModel.findOne(
          {
            riderId: dataDeserialized.id,
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

      if (registrationDB) {
        throw new Error(
          `Данный стартовый номер: ${dataDeserialized.startNumber} уже есть в протоколе у райдера: ${registrationDB.profile.lastName} ${registrationDB.profile.firstName}`
        );
      }

      // Сохранение в БД результата райдера в Заезде Чемпионата.
      await ResultRaceModel.create({
        championship: dataDeserialized.championshipId,
        raceNumber: dataDeserialized.raceNumber,
        startNumber: dataDeserialized.startNumber,
        ...(dataDeserialized.id && { riderId: dataDeserialized.id }),
        profile: {
          firstName: dataDeserialized.firstName,
          lastName: dataDeserialized.lastName,
          ...(dataDeserialized.patronymic && { patronymic: dataDeserialized.patronymic }),
          ...(dataDeserialized.team && { team: dataDeserialized.team }),
          yearBirthday: dataDeserialized.yearBirthday,
          gender: dataDeserialized.gender,
        },
        ...(dataDeserialized.id && { id: dataDeserialized.id }),
        raceTimeInMilliseconds: dataDeserialized.timeDetailsInMilliseconds,
        creatorId,
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
}
