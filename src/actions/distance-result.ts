'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { parseError } from '@/errors/parse';
import { errorHandlerClient } from './error-handler';
import { handlerErrorDB } from '@/services/mongodb/error';
import { DistanceResultService } from '@/services/DistanceResult';

// types
import { ServerResponse, TDistanceResultOptionNames } from '@/types/index.interface';
import { TDistanceResultDto } from '@/types/dto.types';

/**
 * Серверный экшен получения всех результатов на запрашиваемой дистанции с urlSlug: distanceUrlSlug.
 */
export async function getDistanceResults(
  distanceId: string,
  query?: TDistanceResultOptionNames
): Promise<ServerResponse<TDistanceResultDto[] | null>> {
  try {
    const distanceResult = new DistanceResultService();

    const session = await getServerSession(authOptions);

    const res = await distanceResult.get({ distanceId, query, riderDBId: session?.user?.idDB });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
/**
 * Серверный экшен запускает обновление всех результатов на дистанции distanceId.
 */
export async function putDistanceResults({
  distanceId,
  moderationRequest,
}: {
  distanceId: string;
  moderationRequest?: boolean;
}): Promise<ServerResponse<null>> {
  try {
    const session = await getServerSession(authOptions);

    // Обновление доступно только авторизованным пользователям.
    if (!session) {
      return { message: 'Нет авторизации!', ok: false, data: null };
    }

    const distanceResult = new DistanceResultService();

    const res = await distanceResult.put({
      distanceId,
      moderationRequest: moderationRequest || session.user.role?.name === 'admin',
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
