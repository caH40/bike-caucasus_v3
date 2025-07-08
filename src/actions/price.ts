'use server';

import { PriceService } from '@/services/Price';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';

// types
import {
  ServerResponse,
  TEntityNameForSlot,
  TSiteServicePriceForClient,
} from '@/types/index.interface';

/**
 * Серверный экшен получения стоимости за штучный сервис на сайте.
 */
export async function getPriceTier({
  entityName,
}: {
  entityName: TEntityNameForSlot;
}): Promise<ServerResponse<TSiteServicePriceForClient | null>> {
  try {
    const priceService = new PriceService();
    const res = await priceService.getPriceTier({ entityName });

    if (!res.ok) {
      throw new Error(res.message);
    }

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
