'use server';
// Экшены для работы с финишным протоколом Заезда.

import { ResponseServer } from '@/types/index.interface';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { ResultRaceService } from '@/services/ResultRace';
import { TResultRaceDto } from '@/types/dto.types';

/**
 * Получение протокола Заезда Чемпионата.
 */
export async function getProtocolRace({
  championshipId,
  raceNumber,
}: {
  championshipId: string;
  raceNumber: number;
}): Promise<ResponseServer<TResultRaceDto[] | null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.getProtocolRace({
      championshipId,
      raceNumber,
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
