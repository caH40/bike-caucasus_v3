import mongoose, { Schema, model, models, Model } from 'mongoose';

import { TChampionshipDocument } from '@/types/models.interface';

// Трэк заезда.
const trackGPXSchema = new Schema({
  url: String,
  coordStart: {
    // Координаты старта заезда.
    lat: Number,
    lon: Number,
  },
});

/**
 * Схема для чемпионата.
 */
const championshipSchema = new Schema<TChampionshipDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organizer',
      required: true,
    },
    parentChampionshipUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Championship',
      default: null,
    },
    childChampionshipUrls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Championship',
        default: [],
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      required: true,
    },
    championshipType: {
      type: String,
      enum: ['Tour', 'Series', 'Single'],
      required: true,
    },
    bikeType: {
      type: String,
      enum: ['TimeTrial', 'Mountain', 'Road', 'Downhill'],
      required: true,
    },
    trackGPX: { type: trackGPXSchema, default: null },
    posterUrl: { type: String, default: null },
  },
  {
    timestamps: true, // Автоматически добавляет поля createdAt и updatedAt.
  }
);

// Создаем и экспортируем модель
export const ChampionshipModel: Model<TChampionshipDocument> =
  models.Championship || model<TChampionshipDocument>('Championship', championshipSchema);
