import mongoose, { model, models, Schema } from 'mongoose';
import { TTRacePointsTableDocument } from '@/types/models.interface';

const RacePointsRuleSchema = new Schema(
  {
    place: { type: Number, required: true }, // Место в финишном протоколе
    points: { type: Number, required: true }, // Очки за это место
  },
  { _id: false }
);

const RacePointsTableSchema = new Schema<TTRacePointsTableDocument>(
  {
    name: { type: String, required: true },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organizer',
      required: true,
    },
    description: { type: String, default: '' },
    rules: { type: [RacePointsRuleSchema], default: [] },
    fallbackPoints: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const RacePointsTableModel =
  models.RacePointsTable ||
  model<TTRacePointsTableDocument>('RacePointsTable', RacePointsTableSchema);
