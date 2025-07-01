import { Schema } from 'mongoose';

import { TQuantityRidersFinished } from '@/types/models.interface';

/**
 * Схема и модель для результата Райдера в заезде Чемпионата.
 */
export const QuantityRidersFinishedSchema = new Schema<TQuantityRidersFinished>(
  {
    category: Number, // Позиция в возрастной категории или по уровню подготовки. Подразумевается, что используется деление или по возрасту, или по подготовке.!!!
    absolute: Number, // Абсолютная категория.
    absoluteGenderMale: Number, // Абсолютная категория с делением по полу муж/жен.
    absoluteGenderFemale: Number, // Позиция райдера в заезде, выставляется вручную. !В разработке.
  },
  { _id: false }
);
export const AbsoluteQuantityRidersFinishedSchema = new Schema<TQuantityRidersFinished>(
  {
    absolute: Number, // Абсолютная категория.
    absoluteGenderMale: Number, // Абсолютная категория с делением по полу муж/жен.
    absoluteGenderFemale: Number, // Позиция райдера в заезде, выставляется вручную. !В разработке.
  },
  { _id: false }
);
