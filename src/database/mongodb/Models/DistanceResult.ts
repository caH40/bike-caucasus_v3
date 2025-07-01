import mongoose, { model, models, Schema } from 'mongoose';

import { DisqualificationSchema } from './Schema/Disqualification';
import { AbsolutePositionsSchema } from './Schema/Positions';
import { AbsoluteQuantityRidersFinishedSchema } from './Schema/QuantityRidersFinished';
import { AbsoluteGapsInCategoriesSchema } from './Schema/GapsInCategories';

// types
import { TDistanceResultDocument } from '@/types/models.interface';

const DistanceResultSchema = new Schema<TDistanceResultDocument>(
  {
    trackDistance: { type: mongoose.Schema.Types.ObjectId, ref: 'Distance', required: true },
    championship: {
      type: Schema.Types.ObjectId,
      ref: 'Championship',
      required: true,
    },
    raceResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResultRace', // замените на актуальное имя модели
      required: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // замените на актуальное имя модели
      required: true,
    },
    raceTimeInMilliseconds: { type: Number, required: true },
    positions: AbsolutePositionsSchema,
    disqualification: DisqualificationSchema,
    averageSpeed: { type: Number },
    quantityRidersFinished: AbsoluteQuantityRidersFinishedSchema,
    gaps: AbsoluteGapsInCategoriesSchema,
  },
  { timestamps: true }
);

export const DistanceResultModel =
  models.DistanceResult ||
  model<TDistanceResultDocument>('DistanceResult', DistanceResultSchema);
