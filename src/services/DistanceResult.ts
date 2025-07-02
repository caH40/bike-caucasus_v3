import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

// types
import {
  ServerResponse,
  TDistanceResultForSave,
  TGender,
  TPrepareDistanceResultsForSaveParams,
  TServiceEntity,
} from '@/types/index.interface';
import { RaceModel } from '@/database/mongodb/Models/Race';
import { Types } from 'mongoose';
import { ResultRaceModel } from '@/database/mongodb/Models/ResultRace';
import { TDistanceResult, TResultRace } from '@/types/models.interface';
import { TRaceMetaFromMongo } from '@/types/mongo.types';
import { processDistanceResults } from '@/libs/utils/distance-results';
import { DistanceResultModel } from '@/database/mongodb/Models/DistanceResult';

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
  }: {
    distanceId: string;
  }): Promise<ServerResponse<TDistanceResult[] | null>> {
    try {
      const resultsDB = await DistanceResultModel.find({
        trackDistance: distanceId,
      }).lean<TDistanceResult[]>();
      return { data: resultsDB, ok: true, message: 'Данные заезда Чемпионата' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновление таблицы результатов дистанции distanceId.
   */
  public async put({ distanceId }: { distanceId: string }): Promise<ServerResponse<null>> {
    try {
      // Получение всех заездов по дистанции distanceId.
      const races = await RaceModel.find(
        { trackDistance: distanceId },
        { _id: true, championship: true, laps: true }
      ).lean<TRaceMetaFromMongo[]>();

      const raceIds = races.map(({ _id }) => _id);

      // Все результаты.
      const raceResults = await ResultRaceModel.find({ race: { $in: raceIds } }).lean<
        TResultRace[]
      >();

      const distanceResults = this.prepareDistanceResultsForSave({
        raceResults,
        races,
        distanceId,
      });

      // Удаление старых результатов.
      await DistanceResultModel.deleteMany({ trackDistance: distanceId });

      // Сохранение новых результатов.
      await DistanceResultModel.create(distanceResults);

      return {
        data: null,
        ok: true,
        message: `Обновлены результаты для дистанции с _id: ${distanceId}`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Создание массива результатов на дистанции distanceId для сохранения в БД.
   */
  private prepareDistanceResultsForSave({
    raceResults,
    distanceId,
    races,
  }: TPrepareDistanceResultsForSaveParams): TDistanceResultForSave[] {
    const resultsWithUsers: (Omit<TResultRace, 'rider'> & { rider: Types.ObjectId })[] =
      raceResults.filter((r): r is TResultRace & { rider: Types.ObjectId } => !!r.rider);

    // Создание массива результатов на дистанции без расчетных данных.
    // Сортировка по возрастанию финишного времени.
    const results = resultsWithUsers
      .map((result) => {
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
          laps,
          gender: result.profile.gender,
        } satisfies Omit<
          TDistanceResultForSave,
          'positions' | 'gaps' | 'quantityRidersFinished'
        > & { gender: TGender };
      })
      .sort((a, b) => a.raceTimeInMilliseconds - b.raceTimeInMilliseconds);

    // Добавление позиций, отставаний, количество участников по абсолютным категориям.
    const resultsForSave = processDistanceResults(results);

    return resultsForSave;
  }
}
