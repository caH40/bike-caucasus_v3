import { Schema, Model, models, model } from 'mongoose';
import { DisqualificationSchema } from './Schema/Disqualification';
import { ProfileSchema } from './Schema/Profile';
import { PositionsSchema } from './Schema/Positions';
import { GapsInCategoriesSchema } from './Schema/GapsInCategories';

// types
import { TQuantityRidersFinished, TResultRaceDocument } from '@/types/models.interface';
import { PointsSchema } from './Schema/Points';

/**
 * Схема и модель для результата Райдера в заезде Чемпионата.
 */
export const QuantityRidersFinishedSchema = new Schema<TQuantityRidersFinished>(
  {
    category: Number, // Позиция в возрастной категории или по уровню подготовки. Подразумевается, что используется деление или по возрасту, или по подготовке.!!!
    absolute: Number, // Абсолютная категория.
    absoluteGenderMale: Number, // Абсолютная категория с делением по полу муж/жен.
    absoluteGenderFemale: Number, // Позиция райдера в заезде, выставляется вручную. !В разработке.
  },
  { _id: false }
);

const ResultRaceSchema: Schema = new Schema<TResultRaceDocument>(
  {
    championship: { type: Schema.Types.ObjectId, ref: 'Championship', required: true },
    race: { type: Schema.Types.ObjectId, ref: 'Race', required: true },
    rider: { type: Schema.Types.ObjectId, ref: 'User' },
    profile: { type: ProfileSchema },
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
    gapsInCategories: GapsInCategoriesSchema,
    points: { type: PointsSchema, default: null },
    disqualification: { type: DisqualificationSchema, default: null },
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
export const ResultRaceModel: Model<TResultRaceDocument> =
  models.ResultRace || model('ResultRace', ResultRaceSchema);
