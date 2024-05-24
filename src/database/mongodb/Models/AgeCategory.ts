import { models, Schema, model } from 'mongoose';

import type { TAgeCategory } from '@/types/models.interface';

/**
 * Схема и модель возрастной категории.
 */
const AgeCategorySchema = new Schema<TAgeCategory>(
  {
    version: String, // Название версии разделения по возрастным категориям.
    name: String, // Название категории.
    description: String, // Описание версии деления по категориям.
    age: {
      min: Number, // Минимальное количество лет в категории (включительно).
      max: Number, // Максимальное количество лет в категории (включительно).
    },
    gender: String, // Пол.
  },
  { timestamps: true }
);

export const AgeCategory =
  models.AgeCategory || model<TAgeCategory>('AgeCategory', AgeCategorySchema);
