// src/constants/surfaceTranslations.ts
import type {
  TEntityNameForSlot,
  TSurfaceType,
  TYooKassaPaymentStatus,
} from '@/types/index.interface';

export const SURFACE_TYPE_TRANSLATIONS: Record<TSurfaceType, string> = {
  road: 'Асфальт',
  gravel: 'Гравий',
  trail: 'Тропа',
  mixed: 'Смешанное',
  dirt: 'Грунт',
};

export const ENTITY_NAME_TRANSLATIONS: Record<TEntityNameForSlot, string> = {
  championship: 'Чемпионат',
  team: 'Команда',
};

export const YKASSA_PAYMENT_STATUS: Record<TYooKassaPaymentStatus, string> = {
  succeeded: 'Успешно завершен',
  pending: 'Создан и ожидает действий от пользователя',
  waiting_for_capture: 'Оплачен, деньги авторизованы и ожидают списания',
  canceled: 'Отменен',
};
