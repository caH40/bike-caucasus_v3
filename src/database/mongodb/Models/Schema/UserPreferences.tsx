import { TUserPreferences } from '@/types/models.interface';
import { Schema } from 'mongoose';

export const NotificationSchema = new Schema(
  {
    development: { type: Boolean, default: true }, // Оповещения об изменениях на сайте.
    events: { type: Boolean, default: true }, // Оповещения о новых мероприятиях.
    news: { type: Boolean, default: true }, // Оповещения о новостях.
  },
  { _id: false }
);

const PrivacySchema = new Schema(
  {
    profileVisible: { type: Boolean, default: true }, // Видимость профиля другим пользователям.
    showEmail: { type: Boolean, default: false }, // Отображать email публично.
    showPhone: { type: Boolean, default: false }, // Отображать телефон публично.
  },
  { _id: false }
);

export const PreferencesSchema = new Schema<TUserPreferences>(
  {
    showPatronymic: { type: Boolean, default: true }, // Отображать отчество.
    notification: { type: NotificationSchema }, // Настройки уведомлений.
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' }, // Тема интерфейса.
    language: { type: String, default: 'ru' }, // Язык интерфейса по умолчанию.
    privacy: { type: PrivacySchema, default: () => ({}) }, // Настройки приватности.
  },
  { _id: false }
);
