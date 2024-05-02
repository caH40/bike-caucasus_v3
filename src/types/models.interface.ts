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

/**
 * Интерфейс пользователя сайта
 */
export interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  date: number;
  email: string;
  emailConfirm: boolean;
  phone: string;
  firstName: string;
  patronymic: string;
  lastName: string;
  gender: string;
  birthday: number;
  city: string;
  team: string;
  role: string;
  photoProfile: string;
}
/**
 * Модель подтверждения email
 */
export interface IUserConfirm {
  userId: string;
  date: number;
  activationToken: string;
  email: string;
}
/**
 * Модель сброса пароля
 */
export interface IPasswordReset {
  userId: string;
  date: number;
  tokenReset: string;
  email: string;
}
