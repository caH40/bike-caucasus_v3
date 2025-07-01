'use server';

import { parseError } from '@/errors/parse';
import { errorHandlerClient } from './error-handler';
import { handlerErrorDB } from '@/services/mongodb/error';
import { DistanceService } from '@/services/Distance';
import { checkUserAccess } from '@/libs/utils/auth/checkUserPermission';

// types
import { ServerResponse } from '@/types/index.interface';
import { TDistanceDto } from '@/types/dto.types';
import { revalidatePath } from 'next/cache';

/**
 * Экшен отправки данных на сервер для создания дистанции.
 */
export async function postDistance(serializedData: FormData): Promise<ServerResponse<any>> {
  try {
    const { userIdDB } = await checkUserAccess('moderation.distances');

    const distanceService = new DistanceService();

    const response = await distanceService.create({ creatorId: userIdDB, serializedData });

    if (response.ok) {
      revalidatePath('/distances');
    }

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
/**
 * Экшен отправки отредактированных данных на сервер для обновления дистанции.
 */
export async function putDistance(serializedData: FormData): Promise<ServerResponse<any>> {
  try {
    const { userIdDB } = await checkUserAccess('moderation.distances');

    const distanceService = new DistanceService();

    const response = await distanceService.put({ moderatorId: userIdDB, serializedData });

    if (response.ok) {
      revalidatePath('/distances');
    }

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
  urlSlug: string
): Promise<ServerResponse<TDistanceDto | null>> {
  try {
    const distanceService = new DistanceService();
    const response = await distanceService.get(urlSlug);

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
