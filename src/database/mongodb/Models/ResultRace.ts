import { Schema, Model, models, model } from 'mongoose';
import { DisqualificationSchema } from './Schema/Disqualification';
import { ProfileSchema } from './Schema/Profile';
import { PositionsSchema } from './Schema/Positions';
import { GapsInCategoriesSchema } from './Schema/GapsInCategories';
import { PointsSchema } from './Schema/Points';
import { QuantityRidersFinishedSchema } from './Schema/QuantityRidersFinished';

// types
import { TResultRaceDocument } from '@/types/models.interface';

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
