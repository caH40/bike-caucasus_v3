'use server';

import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { RacePointsTableService } from '@/services/RacePointsTable';

// types
import type { ServerResponse } from '@/types/index.interface';
import { TRacePointsTableDto } from '@/types/dto.types';

/**
 * Экшен получения данных по таблице начисления очков за этап серии по _id.
 */
export async function getRacePointsTable({
  racePointsTableId,
}: {
  racePointsTableId: string;
}): Promise<ServerResponse<TRacePointsTableDto | null>> {
  try {
    const racePointsTableService = new RacePointsTableService();
    const racePointsTable = await racePointsTableService.getOne({ racePointsTableId });

    if (!racePointsTable.ok) {
      throw new Error('Данные по таблице начисления очков за этап серии.');
    }

    return racePointsTable;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получения данных по таблице начисления очков за этап серии по _id.
 */
export async function getRacePointsTables(params?: {
  organizerId?: string;
}): Promise<ServerResponse<TRacePointsTableDto[] | null>> {
  try {
    const racePointsTableService = new RacePointsTableService();
    const racePointsTables = await racePointsTableService.getAll({
      organizerId: params?.organizerId,
    });

    if (!racePointsTables.ok) {
      throw new Error('Данные по таблице начисления очков за этап серии.');
    }

    return racePointsTables;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
