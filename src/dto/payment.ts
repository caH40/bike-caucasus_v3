import { TPaymentNotificationDto } from '@/types/dto.types';
import { TPaymentNotification } from '@/types/models.interface';

/**
 * Дто для истории финансовых транзакций.
 */
export function getPaymentNotificationDto(
  notification: TPaymentNotification
): TPaymentNotificationDto {
  const _id = notification._id.toString();
  const user = notification.user.toString();
  const createdAt = notification.createdAt.toISOString();
  const capturedAt = notification.capturedAt.toISOString();
  return { ...notification, _id, user, createdAt, capturedAt };
}
