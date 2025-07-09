import { PaymentNotificationModel } from '@/database/mongodb/Models/PaymentNotification';
import { User } from '@/database/mongodb/Models/User';
import { errorLogger } from '@/errors/error';

// types
import { TPurchaseMetadata, TYooKassaNotification } from '@/types/index.interface';
import { TPaymentNotification } from '@/types/models.interface';
import { Types } from 'mongoose';
import { SiteServiceSlotService } from './SiteServiceSlotService';

/**
 * Сервис работы c эквайрингом.
 */
export class YooKassaNotification {
  private errorLogger;

  constructor() {
    this.errorLogger = errorLogger;
  }

  /**
   * Обработка уведомления от ЮKassa.
   */
  public async handleNotifications(notification: TYooKassaNotification): Promise<void> {
    try {
      switch (notification.event) {
        case 'payment.succeeded': {
          await this.paymentSucceeded(notification);
          break;
        }

        default:
          console.log('=================', notification);

          throw new Error(
            `Нет соответствующего обработчика для уведомления события: ${notification.event}`
          );
      }
    } catch (error) {
      this.errorLogger(error);
    }
  }

  //    {
  //   type: 'notification',
  //   event: 'payment.canceled',
  //   object: {
  //     id: '30000ffc-000f-5000-b000-140a4870705b',
  //     status: 'canceled',
  //     amount: { value: '1000.00', currency: 'RUB' },
  //     description: 'Покупка слотов в количестве 1шт. на создание чемпионатов на сайте bike-caucasus.ru',
  //     recipient: { account_id: '1120099', gateway_id: '2485064' },
  //     created_at: '2025-07-09T05:21:00.353Z',
  //     test: true,
  //     paid: false,
  //     refundable: false,
  //     metadata: { userId: '1000', entityName: 'championship', quantity: '1' },
  //     cancellation_details: { party: 'yoo_money', reason: 'expired_on_confirmation' }
  //   }
  // }

  private async paymentSucceeded({
    object: notification,
    event,
  }: TYooKassaNotification): Promise<void> {
    // Проверка существования данных об платеже в БД.
    const notificationDB = await PaymentNotificationModel.findOne({
      id: notification.id,
      event: event,
      status: notification.status,
    }).lean();

    if (notificationDB) {
      throw new Error(`Уже есть в БД: ${JSON.stringify(notification)}`);
    }

    const userDB = await User.findOne(
      { id: notification.metadata.userId },
      { _id: true }
    ).lean<{
      _id: Types.ObjectId;
    }>();

    if (!userDB) {
      throw new Error(
        `Не найден пользователь с id: ${
          notification.metadata.userId
        }, оплативший сервис: ${JSON.stringify(notification.metadata)}`
      );
    }

    const metadata: TPurchaseMetadata = {
      entityName: notification.metadata.entityName,
      quantity: notification.metadata.quantity,
    };

    const siteServiceSlotService = new SiteServiceSlotService();
    await siteServiceSlotService.handlePurchaseSlot({ user: userDB._id, metadata });

    const query: Omit<TPaymentNotification, '_id'> = {
      user: userDB._id,
      event,
      description: notification.description,
      id: notification.id,
      status: notification.status,
      amount: {
        value: Number(notification.amount.value),
        currency: notification.amount.currency,
      },
      income_amount: {
        value: Number(notification.income_amount.value),
        currency: notification.income_amount.currency,
      },
      capturedAt: new Date(notification.captured_at), //Создан платёж.
      createdAt: new Date(notification.created_at), //Создан платёж.
      metadata,
    };

    await PaymentNotificationModel.create(query);
  }
}
