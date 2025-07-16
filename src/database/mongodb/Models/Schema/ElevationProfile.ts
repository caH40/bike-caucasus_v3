import { Schema } from 'mongoose';

export const ElevationProfileSchema = new Schema(
  {
    positions: {
      type: [
        {
          lat: Number,
          lng: Number,
          ele: Number,
        },
      ],
    },
    metadata: {
      name: { type: String },
      time: { type: String },
      link: {
        type: {
          href: { type: String },
          text: { type: String },
          _id: false,
        },
        default: null,
      },
    },
  },
  {
    _id: false,
  }
);
