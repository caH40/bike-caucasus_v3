import { Schema, model, models } from 'mongoose';

import { type IUserConfirm } from '@/types/models.interface';

const userConfirmSchema = new Schema<IUserConfirm>({
  userId: { type: String, unique: true, required: true },
  date: { type: Number, required: true },
  activationToken: { type: String, required: true },
  email: { type: String, required: true },
});

export const UserConfirm =
  models.UserConfirm || model<IUserConfirm>('UserConfirm', userConfirmSchema);
