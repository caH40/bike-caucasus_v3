import { YooCheckout, IConfirmation } from '@a2seven/yoo-checkout';
import { v4 as uuidv4 } from 'uuid';

import { Environment } from '@/configs/environment';
import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

// types
import { ServerResponse, TCreatePaymentWithMeta } from '@/types/index.interface';
import { PaymentNotificationModel } from '@/database/mongodb/Models/PaymentNotification';
import { TPaymentNotification } from '@/types/models.interface';
import { getPaymentNotificationDto } from '@/dto/payment';
import { TPaymentNotificationDto } from '@/types/dto.types';

/**
 * Сервис работы c эквайрингом.
 */
export class PaymentService {
  private errorLogger;
  private handlerErrorDB;
  private checkout: YooCheckout;

  constructor() {
    const environment = new Environment();
    const config = environment.getYooKassaConfig();

    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.checkout = new YooCheckout({ shopId: config.shopId, secretKey: config.secretKey });
  }

  /**
   * Создание страницы для оплаты.
   */
  public async create({
    createPayload,
  }: {
    createPayload: TCreatePaymentWithMeta;
  }): Promise<ServerResponse<IConfirmation | null>> {
    try {
      const idempotenceKey = uuidv4(); // Новый ключ для каждого вызова.

      const payment = await this.checkout.createPayment(createPayload, idempotenceKey);

      return { data: payment.confirmation, ok: true, message: 'Платеж создан.' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * История всех платежей пользователя.
   */
  public async getHistory({
    userId,
  }: {
    userId: string;
  }): Promise<ServerResponse<TPaymentNotificationDto[] | null>> {
    try {
      const paymentNotificationsDB = await PaymentNotificationModel.find({
        user: userId,
      }).lean<TPaymentNotification[]>();

      // Сортировка времени создания платежа, сначала более свежие.
      paymentNotificationsDB.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const afterDto = paymentNotificationsDB.map((n) => getPaymentNotificationDto(n));

      return { data: afterDto, ok: true, message: 'История операций по платежам.' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
