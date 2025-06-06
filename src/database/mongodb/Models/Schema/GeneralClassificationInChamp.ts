import { Schema } from 'mongoose';

export const GeneralClassificationInChampSchema = new Schema({
  isCounted: { type: Boolean, default: true },
  awardedProtocols: {
    category: { type: Boolean, default: true },
    absolute: { type: Boolean, default: false },
    absoluteGender: { type: Boolean, default: false },
  },
  requiredStage: { type: Boolean, default: false },
});
