import { Schema, model, models } from 'mongoose';

/**
 * Модель Команды.
 */
const TeamSchema = new Schema({
  name: { type: String, unique: true, require: true },
  capitan: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  description: { type: String, default: null },
  city: { type: String, default: null },
});

export const Team = models.Team || model('Team', TeamSchema);
