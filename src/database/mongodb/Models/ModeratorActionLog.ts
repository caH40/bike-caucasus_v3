import mongoose, { Schema, model, models } from 'mongoose';

import { TModeratorActionLogDocument } from '@/types/models.interface';

const ModeratorActionLogSchema = new Schema<TModeratorActionLogDocument>({
  moderator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // ID модератора, выполнившего действие.
  entity: {
    type: String,
    enum: [
      'championship',
      'trail',
      'news',
      'calendar',
      'organizer',
      'raceResult',
      'comment',
      'racePointsTable',
      'generalClassification',
    ],
    required: true,
  }, // Название сущности, над которой было выполнено действие.
  entityIds: { type: [String], required: true }, // ID изменённой сущности.
  action: {
    type: String,
    enum: ['create', 'update', 'delete'],
    required: true,
  }, // Тип действия: создание, обновление или удаление.
  changes: { type: mongoose.Schema.Types.Mixed }, // Объект из запроса на изменение сущности.
  timestamp: { type: Date, default: Date.now }, // Дата и время выполнения действия.
  client: {
    ip: { type: String }, // IP-адрес клиента.
    userAgent: { type: String }, // User-Agent браузера или клиента.
    location: {
      country: { type: String }, // Страна, определённая по IP.
      region: { type: String }, // Регион или область, определённая по IP.
      city: { type: String }, // Город, определённый по IP.
      lat: { type: Number }, // Географическая широта.
      lon: { type: Number }, // Географическая долгота.
    },
  }, // Информация о клиенте, с которого было выполнено действие.
});

export const ModeratorActionLogModel =
  models.ModeratorActionLog ||
  model<TModeratorActionLogDocument>('ModeratorActionLog', ModeratorActionLogSchema);
