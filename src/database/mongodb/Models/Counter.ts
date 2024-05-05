import { Schema, model, models } from 'mongoose';

import { CounterModel } from '@/types/models.interface';

/**
 * Модель генерации уникальных Id (более лаконичные id для последующего использования в паблике)
 */
const CounterSchema = new Schema<CounterModel>({
  name: { type: String, unique: true, require: true },
  sequenceValue: { type: Number, default: 1000 },
});

export const Counter = models.Counter || model<CounterModel>('Counter', CounterSchema);
