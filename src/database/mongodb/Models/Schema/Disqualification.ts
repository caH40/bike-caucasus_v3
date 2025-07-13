import { Schema } from 'mongoose';

import { TDisqualification } from '@/types/models.interface';

export enum EDisqualificationLabel {
  DSQ = 'DSQ', // Disqualified — Дисквалифицирован
  DNF = 'DNF', // Did Not Finish — Не финишировал
  DNS = 'DNS', // Did Not Start — Не стартовал
  OUT = 'OUT', // Out of Classification — Вне зачёта
  CUT = 'CUT', // Time Cut — Превышен лимит времени
  LAP = 'LAP', // Lapped — Обогнан на круг
  NP = 'NP', // No Placement — Без итогового места
  MRS = 'MRS', // Missing Required Stage
  MC = 'MC', // Mixed Categories
  UNC = 'UNC', // Undefined Category
}

/**
 * Схема дисквалификации результата в заезде и в генеральной классификации.
 */
export const DisqualificationSchema = new Schema<TDisqualification>(
  {
    type: { type: String, enum: Object.values(EDisqualificationLabel) },
    comment: { type: String, default: '' },
  },
  { _id: false }
);
