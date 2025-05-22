import mongoose, { ObjectId } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import {
  dtoCheckRegisteredInChamp,
  dtoRegisteredRiders,
  dtoRegisteredInChampRiders,
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
  public async getRidersRace(
    raceId: string
  ): Promise<ResponseServer<TRaceRegistrationDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const registeredRidersDb = await RaceRegistrationModel.find(
        { race: raceId },
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
        message: `Зарегистрированные участники в заезде с _id: ${raceId}`,
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
  public async getRegisteredInChampRiders({
    urlSlug,
    raceId,
  }: {
    urlSlug: string;
    raceId?: string;
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
        raceId,
      });

      const registeredRidersDb = await RaceRegistrationModel.find(
        {
          championship: championshipId,
        },
        { payment: false }
      )
        .populate('rider')
        .lean<TRegisteredRiderFromDB[]>();

      const registeredRiders = dtoRegisteredInChampRiders({
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
   * @param {string} params.raceId - _id заезда в чемпионате.
   * @param {Object} params.updates - Объект с обновляемыми данными регистрации.
   * @param {TRaceRegistrationStatus} params.updates.status - Новый статус регистрации Райдера.
   *
   * @returns {Promise<ResponseServer<null>>} Промис с результатом операции обновления.
   * @throws {Error} Если не удаётся найти чемпионат с заданным URL и номером заезда.
   */
  public async put({
    championshipId,
    raceId,
    riderId,
    updates,
  }: {
    championshipId: string;
    raceId: string;
    riderId: string;
    updates: { status: TRaceRegistrationStatus; startNumber?: number | null };
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const champ = await this.getChamp(championshipId);

      // При отмене регистрации выбранный ранее райдером стартовый номер освобождается.
      if (updates.status === 'canceled') {
        updates.startNumber = null;
      }

      const reg = await RaceRegistrationModel.findOneAndUpdate(
        { race: raceId, rider: riderId },
        { $set: { ...updates } }
      );

      if (!reg) {
        throw new Error(
          `Не найдена регистрация участника _id:${riderId} в заезде _id:${raceId} Чемпионата "${champ.name}" _id:${championshipId}`
        );
      }

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

      // Проверка существования райдера в БД.
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
            'posterUrl',
            'startDate',
            'endDate',
            'urlSlug',
            'type',
            'parentChampionship',
          ],
          populate: { path: 'parentChampionship', select: ['name', 'urlSlug', 'type'] },
        })
        .populate('race')
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
   * Проверка активной регистрации ( status: 'registered') райдера в запрашиваемом Чемпионате.
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
            'posterUrl',
            'startDate',
            'endDate',
            'urlSlug',
            'type',
            'parentChampionship',
          ],
          populate: [{ path: 'parentChampionship', select: ['name', 'urlSlug', 'type'] }],
        })
        .populate('race')
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
   * Если raceId существует, значит получение необходимы данные только этого заезда.
   * Если raceId === undefined значит необходимы данные всех заездов.
   */
  private async getChampionshipData({
    urlSlug,
    raceId,
  }: {
    urlSlug: string;
    raceId?: string;
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
        name: true,
        type: true,
        startDate: true,
        endDate: true,
      }
    )
      .populate('races')
      .lean<TChampionshipForRegistered>();

    if (!champDB) {
      throw new Error(
        `Не найден чемпионат с urlSlug:"${urlSlug}" для добавления финишного результата!`
      );
    }

    // Получение данных Заезда с raceId, или данных всех заездов.
    const races = raceId
      ? champDB.races.filter((race) => race._id.toString() === raceId)
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
        race: raceId,
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
            race: raceId,
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
