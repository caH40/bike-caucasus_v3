import { parseError } from '@/errors/parse';
import { errorHandlerClient } from './error-handler';
import { handlerErrorDB } from '@/services/mongodb/error';
import { DistanceResultService } from '@/services/DistanceResult';

// types
import { ServerResponse } from '@/types/index.interface';
import { TDistanceResult } from '@/types/models.interface';

/**
 * Серверный экшен получения всех результатов на запрашиваемой дистанции с urlSlug: distanceUrlSlug.
 */
export async function getDistanceResults(
  distanceId: string
): Promise<ServerResponse<TDistanceResult[] | null>> {
  try {
    const distanceResult = new DistanceResultService();

    const res = await distanceResult.get({ distanceId });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
/**
 * Серверный экшен запускает обновление всех результатов на дистанции distanceId.
 */
export async function putDistanceResults(distanceId: string): Promise<ServerResponse<null>> {
  try {
    const distanceResult = new DistanceResultService();

    const res = await distanceResult.put({ distanceId });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
