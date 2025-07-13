// src/constants/surfaceTranslations.ts
import type {
  TEntityNameForSlot,
  TRaceDisqualificationLabel,
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

export const RACE_DISQUALIFICATION_LABELS: Record<TRaceDisqualificationLabel, string> = {
  DSQ: 'Дисквалифицирован',
  DNF: 'Не финишировал',
  DNS: 'Не стартовал',
  OUT: 'Вне зачёта / Не выполнены условия',
  CUT: 'Превышен лимит времени',
  LAP: 'Обогнан на круг / Снят с гонки',
  NP: 'Без места / Не имеет итогового места',
  MRS: 'Не завершён обязательный этап серии',
  MC: 'Разные категории участия на этапах',
  UNC: 'Не определена категория в серии',
};
