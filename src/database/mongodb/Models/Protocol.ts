import { TProtocolRace } from '@/types/models.interface';
import { Schema, Model, models, model } from 'mongoose';

/**
 * Схема и модель для протокола заезда в Чемпионате.
 */
const ProtocolRaceSchema: Schema = new Schema<TProtocolRace>(
  {
    championship: { type: Schema.Types.ObjectId, ref: 'Championship', required: true },
    raceNumber: { type: Number, required: true },
    rider: { type: Schema.Types.ObjectId, ref: 'Rider' },
    riderManualEntry: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      patronymic: { type: String },
      team: { type: String },
      age: { type: Number, required: true },
      gender: { type: String, enum: ['male', 'female'], required: true },
      _id: false,
    },
    raceTime: { type: Number },
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Модель для участника заезда
export const ProtocolRaceModel: Model<TProtocolRace> =
  models.ProtocolRace || model('ProtocolRace', ProtocolRaceSchema);
