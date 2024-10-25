import mongoose, { ObjectId } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import {
  dtoCheckRegisteredInChamp,
  dtoRegisteredRiders,
  dtoRegisteredRidersChamp,
  dtoRegistrationsRider,
} from '@/dto/registration-champ';
import { RaceRegistrationModel } from '@/database/mongodb/Models/Registration';
import { User } from '@/database/mongodb/Models/User';
import type {
  ResponseServer,
  TChampionshipForRegistered,
  TChampionshipForRegisteredClient,
  TRegisteredRiderFromDB,
  TRegistrationRaceDataFromForm,
  TRegistrationRiderFromDB,
} from '@/types/index.interface';
import type { TRace, TRaceRegistrationStatus } from '@/types/models.interface';
import type {
  TChampRegistrationRiderDto,
  TRaceRegistrationDto,
  TRegistrationRiderDto,
} from '@/types/dto.types';

/**
 * Класс работы с сущностью Регистрация на Чемпионат.
 */
export class RegistrationChampService {
  private errorLogger;
  private handlerErrorDB;
  private dbConnection: () => Promise<void>;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.dbConnection = connectToMongo;
  }

  /**
   * Регистрация Райдера на Чемпионат.
   */
  public async post({
    championshipId,
    raceNumber,
    riderId,
    startNumber,
    teamVariable,
  }: TRegistrationRaceDataFromForm & { riderId: string }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Проверка существования Чемпионата и запрашиваемого заезда для регистрации.
      const champ: { _id: ObjectId; name: string; races: TRace[] } | null =
        await ChampionshipModel.findOne(
          {
            _id: championshipId,
            'races.number': raceNumber,
          },
          { races: true, name: true }
        );

      if (!champ) {
        throw new Error('Не найден Чемпионат с Заездом!');
      }

      // Проверка зарегистрирован ли уже регистрирующийся райдер в данном Соревновании/Этапе.
      // Можно регистрироваться только в один заезд на Соревновании/Этапе.
      const checkRegistrationStatus: {
        raceNumber: number;
        status: TRaceRegistrationStatus;
      } | null = await RaceRegistrationModel.findOne(
        {
          championship: championshipId,
          rider: riderId,
        },
        { _id: false, raceNumber: true, status: true }
      ).lean();

      if (checkRegistrationStatus && checkRegistrationStatus.status === 'registered') {
        const raceName = champ.races.find(
          (race) => race.number === checkRegistrationStatus.raceNumber
        )?.name;
        throw new Error(`Вы уже зарегистрированы в данном Чемпионате, в заезде: ${raceName}!`);
      }

      // Если статус был canceled, то производить обновление документа, а не создание
      let needUpdateDocument = false;
      if (checkRegistrationStatus?.status === 'canceled') {
        needUpdateDocument = true;
      }

      // Проверка занят ли выбранный стартовый номер для заезда.
      const checkStartNumber = await RaceRegistrationModel.findOne({
        championship: championshipId,
        startNumber,
        raceNumber,
      });

      if (checkStartNumber) {
        throw new Error(`Стартовый номер: ${startNumber} уже занят!`);
      }

      if (!needUpdateDocument) {
        // Регистрация на выбранный Заезд Чемпионата.
        await RaceRegistrationModel.create({
          championship: championshipId,
          rider: riderId,
          raceNumber,
          startNumber,
          status: 'registered',
          ...(teamVariable && { teamVariable }),
        });
      } else {
        await RaceRegistrationModel.findOneAndUpdate(
          {
            championship: championshipId,
            rider: riderId,
          },
          {
            $set: {
              startNumber,
              raceNumber,
              status: 'registered',
              ...(teamVariable && { teamVariable }),
            },
          }
        );

        // Удаление riderId из массива зарегистрированных, для дальнейшего обновления.
        await ChampionshipModel.findByIdAndUpdate(
          { _id: champ._id },
          { $pull: { 'races.$[].registeredRiders': riderId } },
          { new: true }
        );
      }

      // Добавление _id Райдера в массив зарегистрированных в документ Чемпионата в соответствующий Заезд.
      await ChampionshipModel.findByIdAndUpdate(
        { _id: champ._id },
        {
          // Добавить riderId в массив registeredRiders заезда с указанным номером
          $addToSet: {
            'races.$[race].registeredRiders': riderId,
          },
        },
        {
          // Обновить все подходящие элементы в массиве races.
          // race.number это свойство number в объекте race.
          arrayFilters: [{ 'race.number': raceNumber }],
        }
      );

      const messageSuccess = `Вы зарегистрировались, Чемпионат: ${champ.name}, заезд: "${
        champ.races.find((race) => race.number === raceNumber)?.name || '!нет названия!'
      }", стартовый номер: ${startNumber}`;

      return {
        data: null,
        ok: true,
        message: messageSuccess,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение зарегистрированных Райдеров в Заезде (Race) Чемпионата.
   */
  public async getRidersRace({
    championshipId,
    raceNumber,
  }: {
    championshipId: string;
    raceNumber: number;
  }): Promise<ResponseServer<TRaceRegistrationDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const registeredRidersDb: TRegisteredRiderFromDB[] = await RaceRegistrationModel.find(
        {
          championship: championshipId,
          raceNumber,
        },
        { payment: false }
      )
        .populate({
          path: 'rider',
          select: [
            'id',
            'city',
            'team',
            'teamVariable',
            'person.firstName',
            'person.lastName',
            'person.birthday',
            'person.gender',
            'image',
            'imageFromProvider',
            'provider.image',
          ],
        })
        .lean();

      const registeredRiders = dtoRegisteredRiders(registeredRidersDb);

      return {
        data: registeredRiders,
        ok: true,
        message: `Вы зарегистрировались`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение зарегистрированных Райдеров на Этап/Соревнования во всех Заездах
   * или в конкретном заезде raceNumber.
   */
  public async getRidersChamp({
    urlSlug,
    raceNumber,
  }: {
    urlSlug: string;
    raceNumber?: number;
  }): Promise<
    ResponseServer<{
      champRegistrationRiders: TChampRegistrationRiderDto[];
      championship: TChampionshipForRegisteredClient;
    } | null>
  > {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const { championship, races, championshipId } = await this.getChampionshipData({
        urlSlug,
        raceNumber,
      });

      const registeredRidersDb: TRegisteredRiderFromDB[] = await RaceRegistrationModel.find(
        {
          championship: championshipId,
        },
        { payment: false }
      )
        .populate({
          path: 'rider',
          select: [
            'id',
            'city',
            'team',
            'teamVariable',
            'person.firstName',
            'person.lastName',
            'person.patronymic',
            'person.birthday',
            'person.gender',
            'image',
            'imageFromProvider',
            'provider.image',
          ],
        })
        .lean();

      const registeredRiders = dtoRegisteredRidersChamp({
        riders: registeredRidersDb,
        championship,
        races,
      });

      return {
        data: registeredRiders,
        ok: true,
        message: `Зарегистрированные райдеры на Чемпионат Этапа/Соревнования`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновление данных по регистрации Райдера в Заезд Чемпионата.
   *
   * Эта функция обновляет данные регистрации Райдера в конкретном заезде чемпионата,
   * основываясь на динамическом URL страницы чемпионата и номере заезда.
   *
   * @param {Object} params - Параметры для обновления регистрации.
   * @param {string} params.urlSlug - Динамический URL страницы чемпионата.
   * @param {number} params.raceNumber - Номер заезда в чемпионате.
   * @param {Object} params.updates - Объект с обновляемыми данными регистрации.
   * @param {TRaceRegistrationStatus} params.updates.status - Новый статус регистрации Райдера.
   *
   * @returns {Promise<ResponseServer<null>>} Промис с результатом операции обновления.
   * @throws {Error} Если не удаётся найти чемпионат с заданным URL и номером заезда.
   */
  public async put({
    championshipId,
    raceNumber,
    riderId,
    updates,
  }: {
    championshipId: string;
    raceNumber: number;
    riderId: string;
    updates: { status: TRaceRegistrationStatus; startNumber?: number | null };
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      if (!raceNumber || !championshipId || !riderId) {
        throw new Error('Получены не все данные для обновления Регистрации райдера на Заезд!');
      }

      // Проверка существования Чемпионата.
      const champ: { _id: ObjectId } | null = await ChampionshipModel.findOne(
        { _id: championshipId, 'races.number': raceNumber },
        { _id: true, races: true }
      ).lean();

      if (!champ) {
        throw new Error('Не найден Чемпионат с Заездом!');
      }

      // При отмене регистрации выбранный ранее райдером стартовый номер освобождается.
      if (updates.status === 'canceled') {
        updates.startNumber = null;
      }

      await RaceRegistrationModel.findOneAndUpdate(
        {
          championship: champ._id,
          raceNumber,
          rider: riderId,
        },
        { $set: { ...updates } }
      );

      return {
        data: null,
        ok: true,
        message: `Обновлены данные регистрации Райдера.`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение всех текущих (upcoming) регистраций запрашиваемого райдера.
   * @param {Object} params - Параметры для запроса.
   * @param {string} params.riderId - Идентификатор райдера на сайте.
   */
  public async getCurrentRider({
    riderId,
  }: {
    riderId: string;
  }): Promise<ResponseServer<TRegistrationRiderDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Запрос для получения _id Rider.
      const riderDB: { _id: ObjectId } | null = await User.findOne(
        { id: riderId },
        { _id: true }
      ).lean();

      if (!riderDB) {
        throw new Error(`Не найден Пользователь в БД с id на сайте: ${riderId} `);
      }

      const registrationsDb: TRegistrationRiderFromDB[] = await RaceRegistrationModel.find(
        {
          rider: riderDB._id,
        },
        {
          rider: true,
          raceNumber: true,
          startNumber: true,
          status: true,
          createdAt: true,
        }
      )
        .populate({
          path: 'championship',
          select: [
            'status',
            'name',
            'races',
            'posterUrl',
            'startDate',
            'endDate',
            'urlSlug',
            'type',
            'parentChampionship',
          ],
          populate: { path: 'parentChampionship', select: ['name', 'urlSlug', 'type'] },
        })
        .lean();

      const registrationsFiltered = registrationsDb.filter(
        (reg) => reg.championship && reg.championship.status === 'upcoming'
      );

      const registrationsRiderAfterDto = dtoRegistrationsRider(registrationsFiltered);

      return {
        data: registrationsRiderAfterDto,
        ok: true,
        message: `Все актуальные регистрации запрашиваемого райдера с id: ${riderId}`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Проверка активной регистрации райдера в запрашиваемом Чемпионате во всех заездах.
   * Если есть регистрация, то возвращаются данные Заезда.
   * @param {Object} params - Параметры для запроса.
   * @param {string} params.riderId - Идентификатор райдера в БД.
   */
  public async checkRegisteredInChamp({
    idRiderDB,
    champId,
  }: {
    idRiderDB: string;
    champId: string;
  }): Promise<ResponseServer<any | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const registeredInChamp: TRegistrationRiderFromDB | null =
        await RaceRegistrationModel.findOne(
          {
            rider: idRiderDB,
            status: 'registered',
            championship: champId,
          },
          {
            rider: true,
            raceNumber: true,
            startNumber: true,
            status: true,
            createdAt: true,
          }
        )
          .populate({
            path: 'championship',
            select: [
              'status',
              'name',
              'races',
              'posterUrl',
              'startDate',
              'endDate',
              'urlSlug',
              'type',
              'parentChampionship',
            ],
            populate: { path: 'parentChampionship', select: ['name', 'urlSlug', 'type'] },
          })
          .lean();

      const registeredInChampFromDto = dtoCheckRegisteredInChamp(registeredInChamp);

      return {
        data: registeredInChampFromDto,
        ok: true,
        message: `Данные об активной регистрации в Чемпионате райдера с _id: ${idRiderDB}`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Удаление документов регистрации (используется при удалении Чемпионата со всеми заездами).
   */
  public async deleteMany({
    champId,
  }: {
    champId: string;
  }): Promise<ResponseServer<any | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      await RaceRegistrationModel.findOneAndDelete({
        championship: champId,
      });

      return {
        data: null,
        ok: true,
        message: `Удалены все регистрации Чемпионата с _id:${champId}`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение основных данных чемпионата (Этапа).
   * Если raceNumber существует, значит получение необходимы данные только этого заезда.
   * Если raceNumber === undefined значит необходимы данные всех заездов.
   */
  private async getChampionshipData({
    urlSlug,
    raceNumber,
  }: {
    urlSlug: string;
    raceNumber?: number;
  }): Promise<{
    championship: TChampionshipForRegisteredClient;
    races: TRace[];
    championshipId: mongoose.Types.ObjectId;
  }> {
    // Подключение к БД осуществляется в методе в котором вызывается данный метод.

    const champDB: TChampionshipForRegistered | null = await ChampionshipModel.findOne(
      {
        urlSlug,
      },
      {
        _id: true,
        races: true,
        name: true,
        type: true,
        startDate: true,
        endDate: true,
      }
    ).lean();

    if (!champDB) {
      throw new Error(
        `Не найден чемпионат с urlSlug:"${urlSlug}" и заездом №${raceNumber} для добавления финишного результата!`
      );
    }

    // Получение данных Заезда с raceNumber, или данных всех заездов.
    const races = raceNumber
      ? champDB.races.filter((race) => race.number === raceNumber)
      : champDB.races;

    const championship: TChampionshipForRegisteredClient = {
      name: champDB.name,
      type: champDB.type,
      startDate: champDB.startDate,
      endDate: champDB.endDate,
    };

    return { championship, races, championshipId: champDB._id };
  }
}
