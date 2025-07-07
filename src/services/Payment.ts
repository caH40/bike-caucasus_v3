import { YooCheckout, ICreatePayment, Payment } from '@a2seven/yoo-checkout';

import { Environment } from '@/configs/environment';
import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ServerResponse } from '@/types/index.interface';

/**
 * Сервис работы c эквайрингом.
 */
export class PaymentService {
  private errorLogger;
  private handlerErrorDB;
  private checkout: YooCheckout;
  private idempotenceKey: string;

  constructor() {
    const environment = new Environment();
    const config = environment.getYooKassaConfig();

    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.checkout = new YooCheckout({ shopId: config.shopId, secretKey: config.secretKey });
    this.idempotenceKey = Date.now().toString();
  }

  /**
   * Создание страницы для оплаты.
   */
  public async create({
    createPayload,
  }: {
    createPayload: ICreatePayment;
  }): Promise<ServerResponse<Payment | null>> {
    try {
      const payment = await this.checkout.createPayment(createPayload, this.idempotenceKey);

      return { data: payment, ok: true, message: 'Платеж создан.' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
