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
  ProcessRegParams,
  RegChampPostParams,
  ResponseServer,
  TChampionshipForRegistered,
  TChampionshipForRegisteredClient,
  TRegisteredRiderFromDB,
  TRegistrationRiderFromDB,
} from '@/types/index.interface';
import type { TRace, TRaceRegistrationStatus } from '@/types/models.interface';
import type {
  TChampRegistrationRiderDto,
  TRaceRegistrationDto,
  TRegistrationRiderDto,
} from '@/types/dto.types';
import { RaceModel } from '@/database/mongodb/Models/Race';
import { TRegistrationStatusMongo } from '@/types/mongo.types';

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
    raceId,
    riderId,
    startNumber,
    teamVariable,
  }: RegChampPostParams): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Проверка существования Чемпионата и запрашиваемого заезда для регистрации.
      const champ = await this.getChamp(championshipId);

      // Проверка зарегистрирован или был ли зарегистрирован данный участник в других заездах этого чемпионата. Если возвращается raceIdWithCanceledReg - райдер отменял регистрации, поэтому требуется обновление состояния, а не создание новой регистрации.
      const raceIdWithCanceledReg = await this.checkRegistrationStatus({
        championshipId,
        riderId,
      });

      // Проверка занят ли выбранный стартовый номер для заезда.
      await this.checkStartNumber({ startNumber, raceId });

      await this.processReg({
        raceIdWithCanceledReg,
        championshipId,
        riderId,
        raceId,
        startNumber,
        teamVariable,
      });

      // Добавление _id Райдера в массив зарегистрированных в заезд.
      await RaceModel.findByIdAndUpdate(raceId, { $addToSet: { registeredRiders: riderId } });

      // Данные заезда для формирования ответа регистрирующемуся участнику.
      const race = await this.getRace(raceId);

      const messageSuccess = `Вы зарегистрировались, Чемпионат: ${champ.name}, заезд: "${
        race.name || '!нет названия!'
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

      const registeredRidersDb = await RaceRegistrationModel.find(
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
        .lean<TRegisteredRiderFromDB[]>();

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

      const registeredRidersDb = await RaceRegistrationModel.find(
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
        .lean<TRegisteredRiderFromDB[]>();

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
      const champ = await ChampionshipModel.findOne(
        { _id: championshipId, 'races.number': raceNumber },
        { _id: true, races: true }
      ).lean<{ _id: ObjectId }>();

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
      const riderDB = await User.findOne({ id: riderId }, { _id: true }).lean<{
        _id: ObjectId;
      }>();

      if (!riderDB) {
        throw new Error(`Не найден Пользователь в БД с id на сайте: ${riderId} `);
      }

      const registrationsDb = await RaceRegistrationModel.find(
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
        .lean<TRegistrationRiderFromDB[]>();

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

      const registeredInChamp = await RaceRegistrationModel.findOne(
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
        .lean<TRegistrationRiderFromDB>();

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

    const champDB = await ChampionshipModel.findOne(
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
    ).lean<TChampionshipForRegistered>();

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

  /**
   * Данные чемпионата для регистрации.
   */
  private async getChamp(_id: string): Promise<{ name: string }> {
    const champ = await ChampionshipModel.findOne({ _id }, { name: true, _id: false }).lean<{
      name: string;
    }>();

    if (!champ) {
      throw new Error('Не найден Чемпионат!');
    }
    return champ;
  }

  /**
   * Данные заезда для регистрации.
   */
  private async getRace(_id: string): Promise<TRace> {
    const race = await RaceModel.findOne({ _id }).lean<TRace>();

    if (!race) {
      throw new Error('Не найден Заезд!');
    }
    return race;
  }

  /**
   * Проверка зарегистрирован ли уже регистрирующийся райдер в данном Соревновании/Этапе.
   * Можно регистрироваться только в один заезд на Соревновании/Этапе.
   */
  private async checkRegistrationStatus({
    championshipId,
    riderId,
  }: {
    championshipId: string;
    riderId: string;
  }): Promise<mongoose.Types.ObjectId | undefined> {
    const registrationStatus = await RaceRegistrationModel.findOne(
      {
        championship: championshipId,
        rider: riderId,
        status: { $in: ['registered', 'canceled'] },
      },
      { _id: false, raceNumber: true, status: true }
    )
      .populate({ path: 'race', select: ['name'] })
      .lean<TRegistrationStatusMongo>();

    if (registrationStatus && registrationStatus.status === 'registered') {
      throw new Error(
        `Вы уже зарегистрированы в данном Чемпионате, в заезде: ${registrationStatus.race.name}!`
      );
    }

    // Если документ найден и он и status !== 'registered', проверка, может участник отменял регистрацию.
    // Необходимо производить обновление, а не создание документа регистрации.
    if (registrationStatus && registrationStatus.status === 'canceled') {
      return registrationStatus.race._id;
    }
  }

  /**
   * Проверка занят ли выбранный стартовый номер для заезда.
   */
  private async checkStartNumber({
    raceId,
    startNumber,
  }: {
    raceId: string;
    startNumber: number;
  }): Promise<void> {
    const checkStartNumber = await RaceRegistrationModel.findOne(
      {
        raceId,
        startNumber,
      },
      { _id: true }
    ).lean();

    if (checkStartNumber) {
      throw new Error(`Стартовый номер: ${startNumber} уже занят!`);
    }
  }

  /**
   * Создание/обновление документа регистрации RaceRegistration.
   */
  private async processReg({
    raceIdWithCanceledReg,
    championshipId,
    riderId,
    raceId,
    startNumber,
    teamVariable,
  }: ProcessRegParams): Promise<void> {
    if (!raceIdWithCanceledReg) {
      // Регистрация на выбранный Заезд Чемпионата.
      await RaceRegistrationModel.create({
        championship: championshipId,
        rider: riderId,
        raceId,
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
            raceId,
            status: 'registered',
            ...(teamVariable && { teamVariable }),
          },
        }
      );

      // Удаление riderId из массива зарегистрированных (status:'canceled'), для дальнейшего обновления.
      await RaceModel.findByIdAndUpdate(raceIdWithCanceledReg, {
        $pull: { registeredRiders: riderId },
      });
    }
  }
}
