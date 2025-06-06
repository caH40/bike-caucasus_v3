import { Schema } from 'mongoose';

export const AwardedProtocolsSchema = new Schema(
  {
    category: { type: Boolean, default: false },
    absolute: { type: Boolean, default: false },
    absoluteGender: { type: Boolean, default: false },
  },
  { _id: false }
);
