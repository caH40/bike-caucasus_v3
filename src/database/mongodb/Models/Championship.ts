import mongoose, { Schema, model, models, Model } from 'mongoose';

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
    racePointsTable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RacePointsTable',
      default: null,
    },
    parentChampionship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Championship',
      default: null,
    },
    categoriesConfigs: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
    ],
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
    races: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Race', default: [] }],
    posterUrl: { type: String, default: null },
  },
  { timestamps: true }
);

export const ChampionshipModel: Model<TChampionshipDocument> =
  models.Championship || model<TChampionshipDocument>('Championship', championshipSchema);
