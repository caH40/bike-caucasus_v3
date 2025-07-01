import { TGapsInCategories } from '@/types/models.interface';
import { Schema } from 'mongoose';

export const GapsInCategoriesSchema = new Schema<TGapsInCategories>(
  {
    category: { type: { toLeader: Number, toPrev: Number }, default: null, _id: false },
    absolute: { type: { toLeader: Number, toPrev: Number }, default: null, _id: false },
    absoluteGenderMale: {
      type: { toLeader: Number, toPrev: Number },
      default: null,
      _id: false,
    },
    absoluteGenderFemale: {
      type: { toLeader: Number, toPrev: Number },
      default: null,
      _id: false,
    },
  },
  { _id: false }
);

export const AbsoluteGapsInCategoriesSchema = new Schema<TGapsInCategories>(
  {
    absolute: { type: { toLeader: Number, toPrev: Number }, default: null, _id: false },
    absoluteGenderMale: {
      type: { toLeader: Number, toPrev: Number },
      default: null,
      _id: false,
    },
    absoluteGenderFemale: {
      type: { toLeader: Number, toPrev: Number },
      default: null,
      _id: false,
    },
  },
  { _id: false }
);
