'use server';

import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';

// types
import { ServerResponse, TAvailableSlots, TEntityNameForSlot } from '@/types/index.interface';
import { SiteServiceSlotService } from '@/services/SiteServiceSlotService';

/**
 * Серверный экшен по доступным слотам.
 */
export async function getAvailableSlots({
  userDBId,
  entityName,
}: {
  userDBId: string;
  entityName: TEntityNameForSlot;
}): Promise<ServerResponse<TAvailableSlots | null>> {
  try {
    const slotService = new SiteServiceSlotService();
    const res = await slotService.getAvailableSlots({
      userDBId,
      entityName,
    });

    if (!res.ok) {
      throw new Error(res.message);
    }

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
