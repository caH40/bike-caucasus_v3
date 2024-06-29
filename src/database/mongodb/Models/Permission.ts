import { models, Schema, model } from 'mongoose';

import type { TPermissionDocument } from '@/types/models.interface';

/**
 * Схема и модель Разрешений, доступных пользователям, назначаемых админом.
 */
const PermissionSchema = new Schema<TPermissionDocument>(
  {
    name: { type: String, unique: true },
    description: String,
  },
  { timestamps: true }
);

export const Permission =
  models.Permission || model<TPermissionDocument>('Permission', PermissionSchema);

// Пример имени разрешения: moderation.news разрешение на страницу по адресу /moderation/news
