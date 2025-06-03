import { Schema } from 'mongoose';

// types
import { TProfileRiderInProtocol } from '@/types/models.interface';

export const ProfileSchema = new Schema<TProfileRiderInProtocol>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    patronymic: { type: String },
    team: { type: String },
    city: { type: String },
    yearBirthday: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
  },
  { _id: false }
);
