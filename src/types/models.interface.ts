import { ObjectId } from 'mongoose';
import { Date, Types } from 'mongoose';

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
 * Модель пользователя сайта
 */
export interface IUserModel {
  _id: Types.ObjectId;
  id: number;
  credentials?: {
    username: string; // при регистрации через логин/пароль
    password: string; // при регистрации через логин/пароль
  };
  provider: {
    name: string; // провайдер с помощью которого произошла регистрация
    id: string; // провайдер с помощью которого произошла регистрация
    image: string; // путь до картинки профиля с провайдера
  };
  email: string;
  emailConfirm: boolean; // через соцсети автоматически true
  image: string; // путь до картинки профиля
  imageFromProvider: boolean;
  person: {
    firstName: string;
    patronymic: string;
    lastName: string;
    birthday: string;
    gender: string;
    bio: string;
  };
  city: string;
  phone: string;
  team: {
    id: number; // id номер, присваиваемый автоматически при регистрации
    name: string;
  };
  role: string; // !!!! изменить структуру данных, добавить разрешения
  social: {
    telegram?: string;
    vk?: string;
    youtube?: string;
    komoot?: string;
    strava?: string;
    whatsapp?: string;
    garminConnect?: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
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

/**
 * Типизация модели Counter
 */
export type CounterModel = {
  name: string;
  sequenceValue: number;
};

/**
 * Модель новости
 */
export type TNews = {
  title: string;
  subTitle: string;
  blocks: { text: string; image: string | null; position: number }[];
  content: string;
  author: ObjectId | string;
  poster: string;
  hashtags: string[];
};
