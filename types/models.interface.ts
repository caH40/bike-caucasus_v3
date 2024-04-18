import { Types } from 'mongoose';

/**
 * Интерфейс велосипедного маршрута
 */
export interface ICard {
  _id: Types.ObjectId | string;
  nameRoute: string;
  state: string;
  bikeType: string;
  start: string;
  turn: string;
  finish: string;
  distance: string;
  ascent: string;
  descriptionArea: string;
  cardPhoto: string;
  fileTrekName: string;
  urlVideo: string;
  urlTrekGConnect: string;
  // postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // descPhotos: { type: mongoose.Schema.Types.ObjectId, ref: 'Photos' },
  // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  // kudoses: { type: mongoose.Schema.Types.ObjectId, ref: 'Kudos' },
  date: number;
  dateEdit: number;
}
