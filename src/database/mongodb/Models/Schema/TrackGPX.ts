import { Schema } from 'mongoose';

export const TrackGPXSchema = new Schema(
  {
    url: String,
    coordStart: {
      // Координаты старта заезда.
      lat: Number,
      lon: Number,
      _id: false,
    },
  },
  { _id: false }
);
