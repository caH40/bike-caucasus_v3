import mongoose, { Schema, model, models } from 'mongoose';

import { TOrganizerDocument } from '@/types/models.interface';

// Схема для контактной информации
const contactInfoSchema = new Schema(
  {
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: null, trim: true },
    website: { type: String, default: null, trim: true },
    socialMedia: {
      vk: { type: String, default: null, trim: true },
      telegram: { type: String, default: null, trim: true },
      telegramGroup: { type: String, default: null, trim: true },
    },
  },
  { _id: false }
);

// Схема для адреса
const addressSchema = new Schema(
  {
    city: { type: String, required: true, trim: true },
    state: { type: String, default: null, trim: true },
    country: { type: String, default: null, trim: true },
  },
  { _id: false }
);

/**
 * Основная схема для организаторов чемпионатов.
 */
const organizerSchema = new Schema<TOrganizerDocument>(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    urlSlug: { type: String, required: true, unique: true, trim: true },
    name: {
      type: String, // Название организатора.
      required: true,
      unique: true,
      trim: true,
    },
    description: { type: String, default: null, trim: true }, // Описание организатора.
    moderators: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    logoUrl: { type: String, default: null },
    contactInfo: { type: contactInfoSchema, required: true },
    address: { type: addressSchema, required: true, trim: true },
    posterUrl: { type: String, default: null },
    championshipCreationFee: {
      amount: {
        type: Number, // Количество денег на счету.
        required: true,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

export const Organizer =
  models.Organizer || model<TOrganizerDocument>('Organizer', organizerSchema);
