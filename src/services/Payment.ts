import { YooCheckout, IConfirmation } from '@a2seven/yoo-checkout';
import { v4 as uuidv4 } from 'uuid';

import { Environment } from '@/configs/environment';
import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { SiteServicePriceModel } from '@/database/mongodb/Models/SiteServicePrice';
import {
  ServerResponse,
  TCreatePaymentWithMeta,
  TEntityNameForSlot,
  TSiteServicePriceForClient,
} from '@/types/index.interface';

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
   * Получение стоимости за штучный сервис на сайте.
   */
  public async getPriceTier({
    entityName,
  }: {
    entityName: TEntityNameForSlot;
  }): Promise<ServerResponse<TSiteServicePriceForClient | null>> {
    try {
      const siteServicePriceDB = await SiteServicePriceModel.findOne(
        {
          entityName,
        },
        { _id: false }
      ).lean<TSiteServicePriceForClient>();

      if (!siteServicePriceDB) {
        throw new Error(`Не найден прайс лист для услуги ${entityName}`);
      }

      return { data: siteServicePriceDB, ok: true, message: `Цены за сервис ${entityName}` };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
