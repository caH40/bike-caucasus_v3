import mongoose, { Schema } from 'mongoose';

// types
import { TRace } from '@/types/models.interface';
import { TCategoryAge } from '@/types/index.interface';

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

export const RaceSchema = new Schema<TRace>(
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
    categoriesAge: { type: String }, // Название пакета возрастных категорий из Чемпионата.
    categoriesSkillLevel: { type: String, default: null }, // Название пакета категорий по уровню подготовки из Чемпионата.
    categoriesAgeFemale: [{ type: categoryAgeSchema, default: [] }],
    categoriesAgeMale: [{ type: categoryAgeSchema, default: [] }],
    quantityRidersFinished: { type: Number, default: 0 },
  },

  { _id: false }
);
