import mongoose, { Schema, models, model } from 'mongoose';

// types
import { TRaceDocument } from '@/types/models.interface';
import { TrackGPXSchema } from './Schema/TrackGPX';

const RaceSchema = new Schema<TRaceDocument>({
  number: { type: Number, default: 1 }, // Порядковый номер.
  championship: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String, // Должно быть уникальным в рамках одного Соревнования/Этапа.
  description: String, // Краткие детали Заезда.
  laps: { type: Number, default: 1 }, // Количество кругов.
  distance: { type: Number, default: 1 }, // Дистанция Заезда в километрах.
  ascent: { type: Number, default: 0 }, // Набор высоты на дистанции в метрах.
  trackGPX: TrackGPXSchema,
  registeredRiders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },
  quantityRidersFinished: { type: Number, default: 0 },
  trackDistance: { type: mongoose.Schema.Types.ObjectId, ref: 'Distance', default: null },
});

export const RaceModel = models.Race || model<TRaceDocument>('Race', RaceSchema);
