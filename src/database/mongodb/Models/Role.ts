import { models, Schema, model } from 'mongoose';

import type { TRoleModel } from '@/types/models.interface';

/**
 * Схема и модель Роли зарегистрированного пользователя.
 */
const RoleSchema = new Schema<TRoleModel>(
  {
    name: { type: String, unique: true },
    description: String,
    permissions: [String], // ['moderation.news', 'moderation.route','delete.comment']
  },
  { timestamps: true }
);

export const Role = models.Role || model<TRoleModel>('Role', RoleSchema);
