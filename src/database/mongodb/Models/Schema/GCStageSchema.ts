import mongoose, { Schema } from 'mongoose';

import { TStageInGC } from '@/types/models.interface';
import { PositionsSchema } from './Positions';
import { PointsSchema } from './Points';

export const GCStageSchema = new Schema<TStageInGC>(
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
  { _id: false }
);
