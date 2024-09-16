import mongoose, { Schema, model, models, Model } from 'mongoose';

import { TCategoryAge, TChampionshipDocument, TRace } from '@/types/models.interface';

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
const categoryAgeSchema = new Schema<TCategoryAge>(
  {
    min: Number,
    max: Number,
    name: String,
  },
  { _id: false }
);

const raceSchema = new Schema<TRace>(
  {
    number: { type: Number, default: 1 }, // Порядковый номер.
    name: String, // Должно быть уникальным в рамках одного Соревнования/Этапа.
    description: String, // Краткие детали Заезда.
    laps: { type: Number, default: 1 }, // Количество кругов.
    distance: { type: Number, default: 1 }, // Дистанция Заезда в километрах.
    ascent: { type: Number, default: 0 }, // Набор высоты на дистанции в метрах.
    trackGPX: trackGPXSchema,
    registeredRiders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    categoriesAgeFemale: [{ type: categoryAgeSchema, default: [] }],
    categoriesAgeMale: [{ type: categoryAgeSchema, default: [] }],
    quantityRidersFinished: { type: Number, default: 0 },
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
    quantityStages: { type: Number, default: null },
    stage: { type: Number, default: null },
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
    races: [{ type: raceSchema, default: [] }],
    posterUrl: { type: String, default: null },
  },
  {
    timestamps: true, // Автоматически добавляет поля createdAt и updatedAt.
  }
);

// Создаем и экспортируем модель
export const ChampionshipModel: Model<TChampionshipDocument> =
  models.Championship || model<TChampionshipDocument>('Championship', championshipSchema);
