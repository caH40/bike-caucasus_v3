import mongoose, { model, models, Schema } from 'mongoose';

// types
import { TUserPaidServiceAccessDocument } from '@/types/models.interface';
import { TOneTimeServiceSimple, TUsedHistory } from '@/types/index.interface';

// История использования слота (например, создания чемпионата)
const UsedHistorySchema = new Schema<TUsedHistory>(
  {
    entityId: { type: String },
    status: { type: String, enum: ['used', 'canceled'] },
    type: { type: String, enum: ['trial', 'free', 'purchased'] },
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
    purchasedAvailable: { type: Number, default: 0, required: true },
    trialAvailable: { type: Number, default: 0, required: true },
    freeAvailable: { type: Number, default: 0, required: true },
    usedHistory: { type: [UsedHistorySchema], default: [] },
  },
  {
    _id: false,
  }
);

/**
 * Основная схема доступа к платным сервисам пользователя.
 */
const UserPaidServiceAccessSchema = new Schema<TUserPaidServiceAccessDocument>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  oneTimeServices: { type: [OneTimeServicesSchema], default: [] },
});

export const userPaidServiceAccessModel =
  models.UserPaidServiceAccess || model('UserPaidServiceAccess', UserPaidServiceAccessSchema);
