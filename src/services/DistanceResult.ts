import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

import { TRiderRaceResultDto } from '@/types/dto.types';

// types
import { ServerResponse, TServiceEntity } from '@/types/index.interface';

/**
 * Сервис работы с результатами на Дистанции для заездов Чемпионатов.
 */
export class DistanceResult {
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
  }): Promise<ServerResponse<TRiderRaceResultDto | null>> {
    try {
      return { data: null, ok: true, message: 'Данные заезда Чемпионата' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
