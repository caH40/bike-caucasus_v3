import { model, models, Schema } from 'mongoose';

import { TrackGPXSchema } from './Schema/TrackGPX';
import { ElevationProfileSchema } from './Schema/ElevationProfile';

// types
import { TDistanceDocument } from '@/types/models.interface';

/**
 * Схема и модель дистанции для заездов.
 */
const DistanceSchema = new Schema<TDistanceDocument>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    urlSlug: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    trackGPX: { type: TrackGPXSchema, required: true },
    distanceInMeter: { type: Number },
    ascentInMeter: { type: Number },
    avgGrade: { type: Number },
    lowestElev: { type: Number },
    highestElev: { type: Number },
    surfaceType: { type: String, enum: ['road', 'gravel', 'trail', 'mixed'], default: 'road' },
    isPublic: { type: Boolean, default: true },
    isElevationProfileReady: { type: Boolean, default: false },
    elevationProfile: { type: ElevationProfileSchema },
  },
  { timestamps: true }
);

export const DistanceModel =
  models.Distance || model<TDistanceDocument>('Distance', DistanceSchema);
