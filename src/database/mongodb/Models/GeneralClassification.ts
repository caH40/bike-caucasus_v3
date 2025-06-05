import { TGeneralClassificationDocument } from '@/types/models.interface';
import mongoose, { Schema, model, models } from 'mongoose';
import { DisqualificationSchema } from './Schema/Disqualification';
import { ProfileSchema } from './Schema/Profile';
import { PositionsSchema } from './Schema/Positions';
import { GapsInCategoriesSchema } from './Schema/GapsInCategories';
import { PointsSchema } from './Schema/Points';

/**
 * Схема и модель для генеральной классификации серии или тура.
 */
const GeneralClassificationSchema = new Schema<TGeneralClassificationDocument>(
  {
    championship: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Championship' },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    profile: { type: ProfileSchema, required: true },
    positions: {
      type: PositionsSchema,
      default: {
        category: 0,
        absolute: 0,
        absoluteGender: 0,
      },
    },

    categoryAge: { type: String },
    categorySkillLevel: { type: String, default: null },

    totalFinishPoints: { type: PointsSchema, default: null },
    totalTimeInMilliseconds: { type: Number, default: 0 },
    completedStages: { type: Number, default: 0 },
    disqualification: { type: DisqualificationSchema, default: null },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    gapsInCategories: { type: GapsInCategoriesSchema },

    stages: [
      {
        championship: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Championship',
        },
        order: { type: Number, required: true },
        name: { type: String, required: true },
        urlSlug: { type: String, required: true },
        durationInMilliseconds: { type: Number, default: null },
        points: { type: PointsSchema, default: null },
        positions: {
          type: PositionsSchema,
          default: {
            category: 0,
            absolute: 0,
            absoluteGender: 0,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

export const GeneralClassificationModel =
  models.GeneralClassification ||
  model<TGeneralClassificationDocument>('GeneralClassification', GeneralClassificationSchema);
