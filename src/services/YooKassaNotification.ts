import { PaymentNotificationModel } from '@/database/mongodb/Models/PaymentNotification';
import { User } from '@/database/mongodb/Models/User';
import { errorLogger } from '@/errors/error';

// types
import {
  TCreatePayloadMetadata,
  TPurchaseMetadata,
  TYooKassaPaymentEvent,
  TYooKassaPaymentNotification,
} from '@/types/index.interface';
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
  public async handleNotifications(notification: TYooKassaPaymentNotification): Promise<void> {
    try {
      switch (notification.event) {
        case 'payment.succeeded': {
          await this.paymentSucceeded(notification);
          break;
        }

        case 'payment.canceled': {
          await this.paymentCanceled(notification);
          break;
        }

        case 'payment.waiting_for_capture': {
          await this.paymentWaitingForCapture(notification);
          break;
        }

        default:
          // eslint-disable-next-line no-console
          console.log(notification);

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
  }: TYooKassaPaymentNotification): Promise<void> {
    // Проверка существования данных об платеже в БД.
    await this.ensurePaymentNotificationNotExistsByIdAndEvent(notification.id, event);

    const userDB = await this.findUserOrThrow(
      notification.metadata.userId,
      notification.metadata
    );

    const metadata: TPurchaseMetadata = {
      entityName: notification.metadata.entityName,
      quantity: notification.metadata.quantity,
    };

    // Обработка удачной покупки, зачисление слотов пользователю.
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
      capturedAt: notification.captured_at ? new Date(notification.captured_at) : undefined,
      createdAt: new Date(notification.created_at), //Создан платёж.
      metadata,
    };

    await PaymentNotificationModel.create(query);
  }

  private async paymentCanceled({
    object: notification,
    event,
  }: TYooKassaPaymentNotification): Promise<void> {
    // Проверка существования данных об платеже в БД.
    await this.ensurePaymentNotificationNotExistsByIdAndEvent(notification.id, event);

    const userDB = await this.findUserOrThrow(
      notification.metadata.userId,
      notification.metadata
    );

    const metadata: TPurchaseMetadata = {
      entityName: notification.metadata.entityName,
      quantity: notification.metadata.quantity,
    };

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
      createdAt: new Date(notification.created_at), //Создан платёж.
      cancellation_details: notification.cancellation_details,
      metadata,
    };

    await PaymentNotificationModel.create(query);
  }

  private async paymentWaitingForCapture({
    object: notification,
    event,
  }: TYooKassaPaymentNotification): Promise<void> {
    // Проверка существования данных об платеже в БД.
    await this.ensurePaymentNotificationNotExistsByIdAndEvent(notification.id, event);

    const userDB = await this.findUserOrThrow(
      notification.metadata.userId,
      notification.metadata
    );

    const metadata: TPurchaseMetadata = {
      entityName: notification.metadata.entityName,
      quantity: notification.metadata.quantity,
    };

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
      createdAt: new Date(notification.created_at),
      expiresAt: notification.expires_at ? new Date(notification.expires_at) : undefined,
      cancellation_details: notification.cancellation_details,
      metadata,
    };

    await PaymentNotificationModel.create(query);
  }

  /**
   * Проверка, существует ли уведомление с таким id и event.
   */
  private async ensurePaymentNotificationNotExistsByIdAndEvent(
    id: string,
    event: TYooKassaPaymentEvent
  ): Promise<void> {
    const exists = await PaymentNotificationModel.findOne({ id, event }).lean();

    if (exists) {
      throw new Error(`Уведомление уже существует: ${JSON.stringify({ id, event })}`);
    }
  }

  /**
   * Приватный метод для поиска пользователя по `userId` из уведомления.
   * Если пользователь не найден — выбрасывает исключение.
   */
  private async findUserOrThrow(
    userId: number,
    metadata: TCreatePayloadMetadata
  ): Promise<{ _id: Types.ObjectId }> {
    const userDB = await User.findOne({ id: userId }, { _id: true }).lean<{
      _id: Types.ObjectId;
    }>();

    if (!userDB) {
      throw new Error(
        `Не найден пользователь с id: ${userId}, оплативший сервис: ${JSON.stringify(metadata)}`
      );
    }

    return userDB;
  }
}
