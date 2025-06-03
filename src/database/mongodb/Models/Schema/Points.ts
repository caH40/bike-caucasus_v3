import { Schema } from 'mongoose';

// types
import { TPoints } from '@/types/models.interface';

export const PointsSchema = new Schema<TPoints>(
  {
    category: { type: Number, default: 0 }, // Заработанные очки в заезде в возрастной или спецкатегории в зависимости, где райдер участвует.
    absolute: { type: Number, default: 0 }, // Начисление очков для абсолютного протокола.
    absoluteGender: { type: Number, default: 0 }, // Начисление очков для абсолютного протокола.
  },
  { _id: false }
);
