import { TResultRace } from '@/types/models.interface';
import { Schema, Model, models, model } from 'mongoose';

/**
 * Схема и модель для результата Райдера в заезде Чемпионата.
 */

const PositionsSchema = new Schema(
  {
    category: Number, // Позиция в возрастной категории или по уровню подготовки. Подразумевается, что используется деление или по возрасту, или по подготовке.!!!
    absolute: Number, // Абсолютная категория.
    absoluteGender: Number, // Абсолютная категория с делением по полу муж/жен.
    manual: Number, // Позиция райдера в заезде, выставляется вручную. !В разработке.
  },
  { _id: false }
);

const QuantityRidersFinishedSchema = new Schema(
  {
    category: Number, // Позиция в возрастной категории или по уровню подготовки. Подразумевается, что используется деление или по возрасту, или по подготовке.!!!
    absolute: Number, // Абсолютная категория.
    absoluteGenderMale: Number, // Абсолютная категория с делением по полу муж/жен.
    absoluteGenderFemale: Number, // Позиция райдера в заезде, выставляется вручную. !В разработке.
  },
  { _id: false }
);

const ResultRaceSchema: Schema = new Schema<TResultRace>(
  {
    championship: { type: Schema.Types.ObjectId, ref: 'Championship', required: true },
    raceNumber: { type: Number, required: true },
    rider: { type: Schema.Types.ObjectId, ref: 'User' },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      patronymic: { type: String },
      team: { type: String },
      city: { type: String },
      yearBirthday: { type: Number, required: true },
      gender: { type: String, enum: ['male', 'female'], required: true },
      _id: false,
    },
    startNumber: Number,
    raceTimeInMilliseconds: { type: Number, required: true }, // Без времени 0.
    positions: {
      type: PositionsSchema,
      default: {
        category: 0,
        absolute: 0,
        absoluteGender: 0,
      },
    },
    quantityRidersFinished: {
      type: QuantityRidersFinishedSchema,
      default: {
        category: 0,
        absolute: 0,
        absoluteGenderMale: 0,
        absoluteGenderFemale: 0,
      },
    },
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
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
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
