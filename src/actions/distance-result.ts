import { parseError } from '@/errors/parse';
import { errorHandlerClient } from './error-handler';
import { handlerErrorDB } from '@/services/mongodb/error';

// types
import { ServerResponse } from '@/types/index.interface';

/**
 * Серверный экшен получения всех результатов на запрашиваемой дистанции с urlSlug: distanceUrlSlug.
 */
export async function getDistanceResults(distanceId: string): Promise<ServerResponse<null>> {
  try {
    return { data: null, ok: true, message: 'test getDistanceResults' };
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
