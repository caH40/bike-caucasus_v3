import { Schema } from 'mongoose';

export const PositionsSchema = new Schema(
  {
    category: Number, // Позиция в возрастной категории или по уровню подготовки. Подразумевается, что используется деление или по возрасту, или по подготовке.!!!
    absolute: Number, // Абсолютная категория.
    absoluteGender: Number, // Абсолютная категория с делением по полу муж/жен.
  },
  { _id: false }
);
export const AbsolutePositionsSchema = new Schema(
  {
    absolute: Number, // Абсолютная категория.
    absoluteGender: Number, // Абсолютная категория с делением по полу муж/жен.
  },
  { _id: false }
);
