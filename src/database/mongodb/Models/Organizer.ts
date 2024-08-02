import mongoose, { Schema, model, models } from 'mongoose';

import { TOrganizerDocument } from '@/types/models.interface';

// Схема для контактной информации
const contactInfoSchema = new Schema({
  email: { type: String, required: true },
  phone: { type: String, default: null },
  website: { type: String, default: null },
  socialMedia: {
    vk: { type: String, default: null },
    telegram: { type: String, default: null },
  },
});

// Схема для адреса
const addressSchema = new Schema({
  street: { type: String, default: null },
  city: { type: String, required: true },
  state: { type: String, default: null },
  postalCode: { type: String, default: null },
  country: { type: String, default: null },
});

/**
 * Основная схема для организаторов чемпионатов.
 */
const organizerSchema = new Schema<TOrganizerDocument>(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
      type: String, // Название организатора.
      required: true,
      unique: true,
    },
    description: { type: String, default: null }, // Описание организатора.
    logoUrl: { type: String, default: null },
    contactInfo: { type: contactInfoSchema, required: true },
    address: { type: addressSchema, required: true },
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
