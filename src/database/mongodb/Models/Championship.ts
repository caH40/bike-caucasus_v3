import mongoose, { Schema, model, models, Model } from 'mongoose';

import { CategoriesSchema } from './Schema/Category';
import { RaceSchema } from './Schema/Race';

// types
import { TChampionshipDocument } from '@/types/models.interface';

/**
 * Схема для чемпионата.
 */

const championshipSchema = new Schema<TChampionshipDocument>(
  {
    // Название может быть не уникальным,
    // уникальный будет urlSlug из-за добавления номера из счетчика в каждое название.
    name: { type: String, required: true },
    urlSlug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer', required: true },
    parentChampionship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Championship',
      default: null,
    },
    quantityStages: { type: Number, default: null },
    stage: { type: Number, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
      required: true,
    },
    type: { type: String, default: 'single', required: true },
    bikeType: { type: String, default: 'road', required: true },
    categories: CategoriesSchema,
    races: [{ type: RaceSchema, default: [] }],
    posterUrl: { type: String, default: null },
  },
  { timestamps: true }
);

// Создаем и экспортируем модель
export const ChampionshipModel: Model<TChampionshipDocument> =
  models.Championship || model<TChampionshipDocument>('Championship', championshipSchema);
