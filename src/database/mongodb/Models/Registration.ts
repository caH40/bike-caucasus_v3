import { Schema, Model, models, model } from 'mongoose';

import { TRaceRegistrationDocument } from '@/types/models.interface';

// Типы для статусов и методов оплаты
export type TPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'free';
export type TPaymentMethod = 'card' | 'paymentSystem' | 'cash';

// Схема для участника заезда
const RaceRegistrationSchema = new Schema<TRaceRegistrationDocument>(
  {
    championship: { type: Schema.Types.ObjectId, required: true, ref: 'Championship' },
    race: { type: Schema.Types.ObjectId, required: true, ref: 'Race' },
    rider: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    startNumber: { type: Number },
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    teamVariable: { type: String, default: null },
    categorySkillLevel: { type: String, default: null },
    status: {
      type: String,
      enum: ['registered', 'canceled', 'banned'],
      required: true,
    },
    payment: {
      method: { type: String, enum: ['card', 'paymentSystem', 'cash'] },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'free'],
      },
      comment: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// Модель для участника заезда
export const RaceRegistrationModel: Model<TRaceRegistrationDocument> =
  models.RaceRegistration ||
  model<TRaceRegistrationDocument>('RaceRegistration', RaceRegistrationSchema);
