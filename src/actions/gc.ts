'use server';

import { GeneralClassificationService } from '@/services/GeneralClassification';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';

// types
import { ServerResponse, TGetOneGeneralClassificationService } from '@/types/index.interface';

/**
 * Экшен создания/обновления генеральной классификации.
 */
export async function upsertGeneralClassification(
  championshipId: string
): Promise<ServerResponse<any>> {
  try {
    const gcService = new GeneralClassificationService();
    const gcUpsertResponse = await gcService.upsert({ championshipId });

    if (!gcUpsertResponse.ok) {
      throw new Error(gcUpsertResponse.message);
    }

    return gcUpsertResponse;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получения генеральной классификации чемпионата.
 */
export async function getOneGeneralClassification({
  urlSlug,
}: {
  urlSlug: string;
}): Promise<ServerResponse<TGetOneGeneralClassificationService | null>> {
  try {
    const gcService = new GeneralClassificationService();
    const gcResponse = await gcService.getOne({ urlSlug });

    if (!gcResponse.ok) {
      throw new Error(gcResponse.message);
    }

    return gcResponse;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
