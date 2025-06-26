'use server';

import { parseError } from '@/errors/parse';
import { errorHandlerClient } from './error-handler';
import { handlerErrorDB } from '@/services/mongodb/error';
import { DistanceService } from '@/services/Distance';
import { checkUserAccess } from '@/libs/utils/auth/checkUserPermission';

// types
import { ServerResponse } from '@/types/index.interface';
import { TDistanceDto } from '@/types/dto.types';

/**
 * Экшен отправки данных на сервер для создания дистанции.
 */
export async function postDistance(serializedData: FormData): Promise<ServerResponse<any>> {
  try {
    const { userIdDB } = await checkUserAccess('moderation.distances');

    const distanceService = new DistanceService();

    const response = await distanceService.create({ creatorId: userIdDB, serializedData });

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получения дистанции.
 */
export async function getDistance(
  distanceId: string
): Promise<ServerResponse<TDistanceDto | null>> {
  try {
    const distanceService = new DistanceService();
    const response = await distanceService.get(distanceId);

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получения всех дистанций.
 */
export async function getAllDistances(): Promise<ServerResponse<TDistanceDto[] | null>> {
  try {
    const distanceService = new DistanceService();
    const response = await distanceService.getAll();

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
