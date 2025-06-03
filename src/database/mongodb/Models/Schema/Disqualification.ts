import { Schema } from 'mongoose';

import { TDisqualification } from '@/types/models.interface';

/**
 * Схема дисквалификации результата в заезде и в генеральной классификации.
 */
export const DisqualificationSchema = new Schema<TDisqualification>(
  {
    type: { type: String },
    comment: { type: String, default: '' },
  },
  { _id: false }
);
