import mongoose, { model, models, Schema } from 'mongoose';

// types
import { TUserServiceAccessDocument } from '@/types/models.interface';
import { TOneTimeServiceSimple, TUsedHistory } from '@/types/index.interface';

// История использования слота (например, создания чемпионата)
const UsedHistorySchema = new Schema<TUsedHistory>(
  {
    entityId: { type: String },
    status: { type: String, enum: ['used', 'canceled'] },
  },
  {
    timestamps: true, // createdAt и updatedAt
    _id: false,
  }
);

// Поштучные (разовые) сервисы, например создание чемпионата
const OneTimeServicesSchema = new Schema<TOneTimeServiceSimple>(
  {
    entityName: { type: String, enum: ['championship'], required: true },
    available: { type: Number, default: 0, required: true },
    usedHistory: { type: [UsedHistorySchema], default: [] },
  },
  {
    _id: false,
  }
);

/**
 * Основная схема доступа к сервисам пользователя.
 */
const UserServiceAccessSchema = new Schema<TUserServiceAccessDocument>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  oneTimeServices: { type: [OneTimeServicesSchema], default: [] },
});

export const userServiceAccessModel =
  models.UserServiceAccess || model('UserServiceAccess', UserServiceAccessSchema);
