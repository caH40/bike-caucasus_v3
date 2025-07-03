import { TDistanceStats } from '@/types/index.interface';
import mongoose, { Schema } from 'mongoose';

/**
 * Схема статистических данных по результатам на дистанции заездов.
 */
export const DistanceStatsSchema = new Schema<TDistanceStats>(
  {
    uniqueRidersCount: Number,
    totalAttempts: Number,
    lastResultsUpdate: Date,
    bestResultMaleId: mongoose.Schema.Types.ObjectId,
    bestResultFemaleId: mongoose.Schema.Types.ObjectId,
  },
  { _id: false }
);
