import { TRaceRegistrationDocument } from '@/types/models.interface';
import { Schema, Model, models, model } from 'mongoose';

// Типы для статусов и методов оплаты
export type TPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'free';
export type TPaymentMethod = 'card' | 'paymentSystem' | 'cash';

// Схема для участника заезда
const RaceRegistrationSchema: Schema = new Schema(
  {
    championship: { type: Schema.Types.ObjectId, required: true, ref: 'Championship' },
    raceNumber: { type: Number, required: true },
    rider: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    startNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ['registered', 'canceled', 'banned'],
      required: true,
    },
    payment: {
      method: { type: String, enum: ['card', 'paymentSystem', 'cash'], required: true },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'free'],
        required: true,
      },
      comment: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// Модель для участника заезда
export const RaceRegistrationModel: Model<TRaceRegistrationDocument> =
  models.RaceRegistrationModel ||
  model<TRaceRegistrationDocument>('RaceRegistration', RaceRegistrationSchema);
