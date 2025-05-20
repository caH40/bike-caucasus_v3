import mongoose, { Schema, models, model } from 'mongoose';

// types
import { TRaceDocument } from '@/types/models.interface';

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

const RaceSchema = new Schema<TRaceDocument>({
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
  categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },
  quantityRidersFinished: { type: Number, default: 0 },
});

export const RaceModel = models.Races || model<TRaceDocument>('Races', RaceSchema);
