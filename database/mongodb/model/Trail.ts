import mongoose, { Schema, model, models } from 'mongoose';

const trailSchema = new Schema({
  nameRoute: { type: String, required: true },
  state: String,
  bikeType: String,
  start: String,
  turn: String,
  finish: String,
  distance: String,
  ascent: String,
  descriptionArea: String,
  cardPhoto: String,
  fileTrekName: String,
  urlVideo: String,
  urlTrekGConnect: String,
  // postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // descPhotos: { type: mongoose.Schema.Types.ObjectId, ref: 'Photos' },
  // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  // kudoses: { type: mongoose.Schema.Types.ObjectId, ref: 'Kudos' },
  date: Number,
  dateEdit: Number,
});

export const Card = models.Card || model('Card', trailSchema);
