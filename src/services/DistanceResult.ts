import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

// types
import {
  ServerResponse,
  TDistanceResultForSave,
  TDistanceResultsWithGender,
  TDistanceResultWithPosition,
  TDistanceStats,
  TDistanceResultOptionNames,
  TGender,
  TPrepareDistanceResultsForSaveParams,
  TServiceEntity,
} from '@/types/index.interface';
import { RaceModel } from '@/database/mongodb/Models/Race';
import { Types } from 'mongoose';
import { ResultRaceModel } from '@/database/mongodb/Models/ResultRace';
import { TResultRace } from '@/types/models.interface';
import { TDistanceResultFromMongo, TRaceMetaFromMongo } from '@/types/mongo.types';
import { processDistanceResults } from '@/libs/utils/distance-results';
import { DistanceResultModel } from '@/database/mongodb/Models/DistanceResult';
import { distanceResultDto } from '@/dto/distance-result';
import { TDistanceResultDto } from '@/types/dto.types';
import { DistanceModel } from '@/database/mongodb/Models/Distance';
import { millisecondsInHour } from '@/constants/date';
import { formatTimeToStr } from '@/libs/utils/timer';
import { setResultGaps } from '@/libs/utils/gap';

/**
 * Сервис работы с результатами на Дистанции для заездов Чемпионатов.
 */
export class DistanceResultService {
  private errorLogger;
  private handlerErrorDB;
  private entity: TServiceEntity;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.entity = 'raceResult';
  }

  public async get({
    distanceId,
    riderDBId,
    query = 'all',
  }: {
    distanceId: string;
    riderDBId?: string; // Если нет, то абсолютные протоколы, иначе результаты райдера riderId.
    query?: TDistanceResultOptionNames;
  }): Promise<ServerResponse<TDistanceResultDto[] | null>> {
    try {
      const resultsDB = await DistanceResultModel.find({ trackDistance: distanceId })
        .populate({ path: 'championship', select: ['urlSlug', 'startDate', '-_id'] })
        .populate('rider')
        .lean<TDistanceResultFromMongo[]>();

      // Сортировка по возрастанию времени на дистанции.
      resultsDB.sort((a, b) => a.raceTimeInMilliseconds - b.raceTimeInMilliseconds);

      const filteredResults = this.filterResultsByQuery({
        results: resultsDB,
        riderDBId,
        query,
      });

      // Сортировка по возрастанию времени на дистанции.
      filteredResults.sort((a, b) => a.raceTimeInMilliseconds - b.raceTimeInMilliseconds);

      // Выбор и установка позиции в протоколе, согласно запроса query.
      const resultsWithPositionsByQuery = this.setPositionsByQuery({
        results: filteredResults,
        query,
      });

      const resultsWithGaps = setResultGaps({
        results: resultsWithPositionsByQuery,
        getTime: (r) => r.raceTimeInMilliseconds,
      });

      const resultsAfterDto = resultsWithGaps.map((result) => distanceResultDto(result));

      return { data: resultsAfterDto, ok: true, message: 'Результаты на дистанции' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Фильтрация результатов согласно запросу query.
   */
  private filterResultsByQuery({
    results,
    query,
    riderDBId,
  }: {
    results: TDistanceResultFromMongo[];
    query: TDistanceResultOptionNames;
    riderDBId?: string;
  }): TDistanceResultFromMongo[] {
    return results.filter((r) => {
      switch (query) {
        case 'male':
          return r.rider.person.gender === 'male' && r.isBestForRank;
        case 'female':
          return r.rider.person.gender === 'female' && r.isBestForRank;
        case 'my':
          return r.rider._id.toString() === riderDBId;
        default:
          return r.isBestForRank;
      }
    });
  }

  /**
   * Установка позиций в результаты согласно запросу query.
   */
  private setPositionsByQuery({
    results,
    query,
  }: {
    results: TDistanceResultFromMongo[];
    query: TDistanceResultOptionNames;
    riderDBId?: string;
  }): TDistanceResultWithPosition[] {
    return results.map((r, index) => {
      const { positions, ...result } = r;

      let position = ['male', 'female'].includes(query)
        ? positions.absoluteGender
        : positions.absolute;

      if (query === 'my') {
        position = query === 'my' ? index + 1 : position;
      }

      return { ...result, position };
    });
  }

  /**
   * Обновление таблицы результатов дистанции distanceId.
   */
  public async put({
    distanceId,
    moderationRequest,
  }: {
    distanceId: string;
    moderationRequest?: boolean;
  }): Promise<ServerResponse<null>> {
    try {
      // Если запрос на модерацию не от модератора, то разрешать обновлять раз в 1 час.
      await this.checkUpdatedResults(distanceId, moderationRequest);

      // Получение всех заездов по дистанции distanceId.
      const races = await RaceModel.find(
        { trackDistance: distanceId },
        { _id: true, championship: true, laps: true }
      ).lean<TRaceMetaFromMongo[]>();

      const raceIds = races.map(({ _id }) => _id);

      // Все результаты.
      const raceResults = await ResultRaceModel.find({
        race: {
          $in: raceIds,
        },
        $or: [
          { disqualification: { $exists: false } },
          { disqualification: { $eq: undefined } },
          { disqualification: { $eq: null } },
        ],
      }).lean<TResultRace[]>();

      const distanceResults = this.prepareDistanceResultsForSave({
        raceResults,
        races,
        distanceId,
      });

      // Удаление старых результатов.
      await DistanceResultModel.deleteMany({ trackDistance: distanceId });

      // Сохранение новых результатов.
      await DistanceResultModel.create(distanceResults);

      // Добавление статистики по результатам в документ дистанции.
      const stats = this.createStats(distanceResults);
      const distance = await DistanceModel.findOneAndUpdate(
        { _id: distanceId },
        { $set: { stats } }
      );

      return {
        data: null,
        ok: true,
        message: `Обновлены результаты для дистанции "${distance?.name}"`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  private createStats(results: TDistanceResultsWithGender[]): TDistanceStats {
    const uniqueRidersCount = results.filter((r) => r.isBestForRank).length;
    const totalAttempts = results.length;
    const lastResultsUpdate = new Date();
    const bestResultMaleId = results.find(
      (r) => r.positions.absolute === 1 && r.gender === 'male'
    )?.raceResult;
    const bestResultFemaleId = results.find(
      (r) => r.positions.absolute === 1 && r.gender === 'female'
    )?.raceResult;

    return {
      totalAttempts,
      uniqueRidersCount,
      lastResultsUpdate,
      bestResultMaleId,
      bestResultFemaleId,
    };
  }

  /**
   * Создание массива результатов на дистанции distanceId для сохранения в БД.
   */
  private prepareDistanceResultsForSave({
    raceResults,
    distanceId,
    races,
  }: TPrepareDistanceResultsForSaveParams): TDistanceResultsWithGender[] {
    // Фильтруются результаты от незарегистрированных(на сайте) участников.
    const resultsWithUsers: (Omit<TResultRace, 'rider'> & { rider: Types.ObjectId })[] =
      raceResults.filter((r): r is TResultRace & { rider: Types.ObjectId } => !!r.rider);

    // Коллекция для сохранения _id райдеров для пометки флагом самый лучший результат и последующие.
    const uniqueRiderId = new Set<string>();

    // Сортировка по финишному времени.
    // Выявление лучшего результата у пользователя (если у несколько результатов у пользователя) и отметка результатов соответствующими флагами.
    const sortedResultsWithRankFlag = resultsWithUsers
      .toSorted((a, b) => a.raceTimeInMilliseconds - b.raceTimeInMilliseconds)
      .map((result) => {
        let isBestForRank = true;
        const riderId = result.rider.toString();

        // Если уже есть _id, значит лучший результат был помещен флагом isBestForRank:true
        if (uniqueRiderId.has(riderId)) {
          isBestForRank = false;
        } else {
          isBestForRank = true;
          uniqueRiderId.add(riderId);
        }
        return { ...result, isBestForRank };
      });

    // Создание массива результатов на дистанции без расчетных данных.
    const results = sortedResultsWithRankFlag.map((result) => {
      const race = races.find((r) => r._id.equals(result.race));

      if (!race) {
        throw new Error(
          `Не найден заезд для создания результата на дистанции с _id: ${result._id}`
        );
      }
      const { laps, championship } = race;

      return {
        championship,
        trackDistance: distanceId,
        raceResult: result._id,
        rider: result.rider,
        raceTimeInMilliseconds: result.raceTimeInMilliseconds,
        averageSpeed: result.averageSpeed,
        isBestForRank: result.isBestForRank,
        laps,
        gender: result.profile.gender,
      } satisfies Omit<
        TDistanceResultForSave,
        'positions' | 'gaps' | 'quantityRidersFinished'
      > & { gender: TGender };
    });

    // Добавление позиций, отставаний, количество участников по абсолютным категориям.
    const resultsForSave = processDistanceResults(results);

    return resultsForSave;
  }

  /**
   * Если запрос на модерацию не от модератора, то разрешать обновлять раз в 1 час.
   */
  private async checkUpdatedResults(
    distanceId: string,
    moderationRequest?: boolean
  ): Promise<void> {
    // Если запрос от модератора, проверка не нужна.
    if (moderationRequest) {
      return;
    }

    const distanceStats = await DistanceModel.findOne(
      { _id: distanceId },
      { stats: true, _id: false }
    ).lean<{ stats?: TDistanceStats }>();

    // Если нет даты обновления, разрешаем обновление.
    if (!distanceStats?.stats?.lastResultsUpdate) {
      return;
    }

    const now = Date.now();
    const lastUpdate = distanceStats.stats.lastResultsUpdate.getTime();
    const differenceInMilliseconds = now - lastUpdate;

    if (differenceInMilliseconds < millisecondsInHour) {
      const waitTime = millisecondsInHour - differenceInMilliseconds;
      throw new Error(
        `Обновление доступно раз в час. Попробуйте снова через ${formatTimeToStr(waitTime)}.`
      );
    }
  }
}
