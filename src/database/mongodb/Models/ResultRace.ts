import { TResultRace } from '@/types/models.interface';
import { Schema, Model, models, model } from 'mongoose';

/**
 * Схема и модель для результата Райдера в заезде Чемпионата.
 */
const ResultRaceSchema: Schema = new Schema<TResultRace>(
  {
    championship: { type: Schema.Types.ObjectId, ref: 'Championship', required: true },
    raceNumber: { type: Number, required: true },
    riderId: Number,
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      patronymic: { type: String },
      team: { type: String },
      yearBirthday: { type: Number, required: true },
      gender: { type: String, enum: ['male', 'female'], required: true },
      _id: false,
    },
    raceTimeInMilliseconds: { type: Number, required: true }, // Без времени 0.
    position: { type: Number },
    positionManual: { type: Number },
    points: { type: Schema.Types.Mixed }, // Используем Mixed для произвольного типа данных
    disqualification: {
      reason: { type: String }, // 'DNF' | 'DSQ' | 'DNS'
      comment: { type: String },
      _id: false,
    },
    categoryAge: { type: String },
    categorySkillLevel: { type: String },
    averageSpeed: { type: Number },
    lapTimes: { type: [Number] },
    remarks: { type: String },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Модель для участника заезда
export const ResultRaceModel: Model<TResultRace> =
  models.ResultRace || model('ResultRace', ResultRaceSchema);
