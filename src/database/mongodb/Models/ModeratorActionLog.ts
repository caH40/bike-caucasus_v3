import mongoose, { Schema, model, models } from 'mongoose';

import { TModeratorActionLogDocument } from '@/types/models.interface';

const ModeratorActionLogSchema = new Schema<TModeratorActionLogDocument>({
  moderator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // ID модератора, выполнившего действие.
  entity: {
    type: String,
    enum: [
      'championship',
      'championshipCategories',
      'championshipRaces',
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
    deviceInfo: {
      userAgent: { type: String, default: null },
      language: { type: String, default: null },
      screenResolution: { type: String, default: null },
    },
    location: {
      ip: { type: String, default: null },
      city: { type: String, default: null },
      region: { type: String, default: null },
      country: { type: String, default: null },
      timezone: { type: String, default: null },
    },
  }, // Информация о клиенте, с которого было выполнено действие.
});

export const ModeratorActionLogModel =
  models.ModeratorActionLog ||
  model<TModeratorActionLogDocument>('ModeratorActionLog', ModeratorActionLogSchema);
