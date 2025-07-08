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

    const query: Omit<TPaymentNotification, '_id' | 'createdAt' | 'updatedAt'> = {
      user: userDB._id,
      event,
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
      metadata,
    };

    await PaymentNotificationModel.create(query);
  }
}
