'use server';
import { IConfirmation } from '@a2seven/yoo-checkout';

import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { PaymentService } from '@/services/Payment';
import { handlerErrorDB } from '@/services/mongodb/error';

// types
import { ServerResponse, TCreatePaymentWithMeta } from '@/types/index.interface';

/**
 * Серверный экшен оплаты.
 */
export async function createPayment({
  createPayload,
}: {
  createPayload: TCreatePaymentWithMeta;
}): Promise<ServerResponse<IConfirmation | null>> {
  try {
    const paymentService = new PaymentService();
    const res = await paymentService.create({ createPayload });

    if (!res.ok) {
      throw new Error(res.message);
    }

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
