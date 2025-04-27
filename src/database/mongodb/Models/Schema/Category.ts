import { TCategories, TCategoryAge, TCategorySkillLevel } from '@/types/index.interface';
import { Schema } from 'mongoose';

// Схемы Категорий в Чемпионатах.
const CategoryAgeSchema = new Schema<TCategoryAge>(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    name: { type: String },
  },
  { _id: false }
);

const CategorySkillLevelSchema = new Schema<TCategorySkillLevel>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

// Основная схема TCategories
export const CategoriesSchema = new Schema<TCategories>(
  {
    age: [
      {
        name: { type: String, required: true },
        female: { type: [CategoryAgeSchema], required: true },
        male: { type: [CategoryAgeSchema], required: true },
      },
    ],
    skillLevel: [
      {
        name: { type: String, required: true },
        female: { type: [CategorySkillLevelSchema], required: true },
        male: { type: [CategorySkillLevelSchema], required: true },
      },
    ],
  },
  { _id: false }
);
