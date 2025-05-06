import mongoose, { model, models, Schema, Document } from 'mongoose';

// types
import { TCategoryAge, TCategorySkillLevel } from '@/types/index.interface';
import { TCategories } from '@/types/models.interface';

interface ICategoryDocument extends Omit<TCategories, '_id'>, Document {}

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
export const CategoriesSchema = new Schema<ICategoryDocument>({
  championship: { type: mongoose.Schema.Types.ObjectId, ref: 'Championship', required: true },
  name: { type: String, required: true }, // Должно быть уникальным в пределах одного Чемпионата.
  age: {
    female: { type: [CategoryAgeSchema], required: true },
    male: { type: [CategoryAgeSchema], required: true },
  },
  skillLevel: {
    type: new Schema(
      {
        female: { type: [CategorySkillLevelSchema] },
        male: { type: [CategorySkillLevelSchema] },
      },
      { _id: false }
    ),
    default: undefined,
  },
});

export const CategoriesModel =
  models.Categories || model<ICategoryDocument>('Categories', CategoriesSchema);
