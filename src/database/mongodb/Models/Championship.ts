import mongoose, { Schema, model, models, Model } from 'mongoose';

import { TChampionshipDocument } from '@/types/models.interface';

// Трэк заезда.
const trackGPXSchema = new Schema(
  {
    url: String,
    coordStart: {
      // Координаты старта заезда.
      lat: Number,
      lon: Number,
      _id: false,
    },
  },
  { _id: false }
);

/**
 * Схема для чемпионата.
 */
const championshipSchema = new Schema<TChampionshipDocument>(
  {
    // Название может быть не уникальным,
    // уникальный будет urlSlug из-за добавления номера из счетчика в каждое название.
    name: {
      type: String,

      required: true,
    },
    urlSlug: {
      type: String,
      required: true,
      unique: true,
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
    parentChampionship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Championship',
      default: null,
    },
    stages: [
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
      default: 'upcoming',
      required: true,
    },
    type: {
      type: String,
      default: 'single',
      required: true,
    },
    bikeType: {
      type: String,
      default: 'road',
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
