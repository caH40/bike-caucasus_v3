import mongoose, { ObjectId, Types } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import {
  dtoCheckRegisteredInChamp,
  dtoRegisteredRiders,
  dtoRegisteredInChampRiders,
  dtoRegistrationRider,
} from '@/dto/registration-champ';
import { RaceRegistrationModel } from '@/database/mongodb/Models/Registration';
import { User } from '@/database/mongodb/Models/User';
import type {
  ProcessRegParams,
  RegChampPostParams,
  ServerResponse,
  TChampionshipForRegistered,
  TChampionshipForRegisteredClient,
  TGetStartNumbers,
  TRaceWithCategories,
  TRegisteredRiderFromDB,
  TRegistrationRiderFromDB,
} from '@/types/index.interface';
import type { TCategories, TRace, TRaceRegistrationStatus } from '@/types/models.interface';
import type {
  TChampRegistrationRiderDto,
  TRaceRegistrationDto,
  TRegistrationRiderDto,
} from '@/types/dto.types';
import { RaceModel } from '@/database/mongodb/Models/Race';
import { TRegistrationStatusMongo } from '@/types/mongo.types';
import { DEFAULT_AGE_NAME_CATEGORY } from '@/constants/category';
import { ResultRaceModel } from '@/database/mongodb/Models/ResultRace';

/**
 * Класс работы с сущностью Регистрация на Чемпионат.
 */
export class RegistrationChampService {
  private errorLogger;
  private handlerErrorDB;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
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
    categoryName,
  }: RegChampPostParams): Promise<ServerResponse<null>> {
    try {
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
        categoryName,
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
  ): Promise<ServerResponse<TRaceRegistrationDto[] | null>> {
    try {
      const registeredRidersDb = await RaceRegistrationModel.find(
        { race: raceId },
        { payment: false }
      )
        .populate('rider')
        .lean<TRegisteredRiderFromDB[]>();

      const raceDb = await RaceModel.findOne({ _id: raceId }, { _id: false, categories: true })
        .populate('categories')
        .lean<{ categories: TCategories }>();

      if (!raceDb) {
        throw new Error(`Не найден заезд с _id: ${raceId}`);
      }

      const registeredRiders = dtoRegisteredRiders(registeredRidersDb, raceDb?.categories);

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
   * или в конкретном заезде raceId.
   */
  public async getRegisteredInChampRiders({
    urlSlug,
    raceId,
  }: {
    urlSlug: string;
    raceId?: string;
  }): Promise<
    ServerResponse<{
      champRegistrationRiders: TChampRegistrationRiderDto[];
      championship: TChampionshipForRegisteredClient;
    } | null>
  > {
    try {
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

      const registeredRiders = [] as TChampRegistrationRiderDto[];

      for (const race of races) {
        const registeredRidersInRace = dtoRegisteredInChampRiders({
          riders: registeredRidersDb,
          race,
        });
        registeredRiders.push(registeredRidersInRace);
      }

      return {
        data: { champRegistrationRiders: registeredRiders, championship },
        ok: true,
        message: `Зарегистрированные райдеры на Чемпионат Этапа/Соревнования`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение зарегистрированных Райдеров на Этап/Соревнования в заезде
   * для создания финишных результатов.
   */
  public async getRegisteredRidersForProtocol({
    urlSlug,
    raceId,
  }: {
    urlSlug: string;
    raceId: string;
  }): Promise<
    ServerResponse<{
      registeredRiders: TRaceRegistrationDto[];
    } | null>
  > {
    try {
      // Все зарегистрированные участники в заезде (raceId) чемпионата (urlSlug).
      const registeredRides = await this.getRegisteredInChampRiders({ urlSlug, raceId });

      if (!registeredRides.data) {
        throw new Error(registeredRides.message);
      }

      const { championship, champRegistrationRiders } = registeredRides.data;

      // Участники, результаты которых добавлены в финишный протокол.
      const resultsDB = await ResultRaceModel.find(
        {
          championship: championship._id,
          race: raceId,
        },
        { _id: false, rider: true }
      ).lean<{ rider: Types.ObjectId }[]>();

      // Берем [0] нулевой элемент массива заездов, так как заезд был один - запрашиваемый raceId, а не все заезды чемпионата (при отсутствии raceId).
      const filteredRegisteredRides = champRegistrationRiders[0].raceRegistrationRider.filter(
        (registration) =>
          !resultsDB.some(
            (result) => result.rider && result.rider.equals(registration.rider._id)
          )
      );

      return {
        data: { registeredRiders: filteredRegisteredRides },
        ok: true,
        message: `Зарегистрированные райдеры для формирования финишного протокола заезда.`,
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
   * @returns {Promise<ServerResponse<null>>} Промис с результатом операции обновления.
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
  }): Promise<ServerResponse<null>> {
    try {
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
  }): Promise<ServerResponse<TRegistrationRiderDto[] | null>> {
    try {
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
          populate: { path: 'parentChampionship', select: ['name', 'urlSlug', 'type', '-_id'] },
        })
        .populate({ path: 'race', populate: 'trackDistance' })
        .populate('rider')
        .lean<TRegistrationRiderFromDB[]>();

      const registrationsFiltered = registrationsDb.filter(
        (reg) => reg.championship && reg.championship.status === 'upcoming'
      );

      const registrationsRiderAfterDto = registrationsFiltered.map((registration) =>
        dtoRegistrationRider(registration)
      );

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
  }): Promise<ServerResponse<any | null>> {
    try {
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
  }): Promise<ServerResponse<any | null>> {
    try {
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
   * Получение свободных стартовых номеров в Чемпионате.
   * На все заезды в чемпионате (single, stage) единый диапазон номеров.
   */
  public async getStartNumbers(
    urlSlug: string
  ): Promise<ServerResponse<TGetStartNumbers | null>> {
    try {
      const champ = await this.getChampionshipData({ urlSlug });

      // Зарегистрированные райдеры в чемпионате во всех заездах.
      const registeredRiders = await RaceRegistrationModel.find(
        {
          championship: champ.championshipId,
        },
        { _id: false, startNumber: true }
      ).lean<{ startNumber: number }[]>();

      // Список занятых стартовых номеров.
      const occupiedStartNumbers = registeredRiders
        .map((r) => r.startNumber)
        .filter((r) => Boolean(r))
        .sort((a, b) => a - b);

      // Инициализация массива свободных стартовых номеров.
      const freeStartNumbers: number[] = [];

      const { start, end } = champ.championship.startNumbers;

      for (let i = start; i <= end; i++) {
        // Если номер не занят то добавляем в список свободных стартовых номеров.
        if (!occupiedStartNumbers.includes(i)) {
          freeStartNumbers.push(i);
        }
      }

      return {
        data: { free: freeStartNumbers, occupied: occupiedStartNumbers },
        ok: true,
        message: `Свободные и занятые стартовые номера во всех заездах чемпионата "${champ.championship.name}"`,
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
    races: TRaceWithCategories[];
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
        startNumbers: true,
        startDate: true,
        endDate: true,
      }
    )
      .populate({ path: 'races', populate: 'categories' })
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
      _id: champDB._id.toString(),
      name: champDB.name,
      type: champDB.type,
      startDate: champDB.startDate,
      endDate: champDB.endDate,
      startNumbers: champDB.startNumbers,
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
    categoryName,
  }: ProcessRegParams): Promise<void> {
    // Если название Возрастная, значит SkillLevel: null
    const categorySkillLevel = categoryName === DEFAULT_AGE_NAME_CATEGORY ? null : categoryName;

    if (!raceIdWithCanceledReg) {
      // Регистрация на выбранный Заезд Чемпионата.
      await RaceRegistrationModel.create({
        championship: championshipId,
        rider: riderId,
        race: raceId,
        startNumber,
        status: 'registered',
        categorySkillLevel,
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
            categorySkillLevel,
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
