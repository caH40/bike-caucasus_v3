import { Schema, model, models } from 'mongoose';

import { type IPasswordReset } from '@/types/models.interface';

const passwordResetSchema = new Schema<IPasswordReset>({
  userId: { type: String, required: true },
  date: { type: Number, required: true },
  tokenReset: { type: String, required: true },
  email: { type: String, required: true },
});

export const PasswordReset =
  models.PasswordReset || model<IPasswordReset>('PasswordReset', passwordResetSchema);
