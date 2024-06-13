import { Document, ObjectId } from 'mongoose';
import { TFormCalendar } from './index.interface';

/**
 * Типизация модели пользователя сайта (Профиля).
 */
export type IUserModel = {
  _id: ObjectId;
  id: number; // Порядковый номер,  присваиваемый при регистрации.
  credentials: {
    username: string; // при регистрации через логин/пароль
    password: string; // при регистрации через логин/пароль
  } | null;
  provider: {
    name: string; // провайдер с помощью которого произошла регистрация
    id: string; // провайдер с помощью которого произошла регистрация
    image?: string; // путь до картинки профиля с провайдера
  } | null;
  email: string;
  emailConfirm: boolean; // через соцсети автоматически true
  image: string; // путь до картинки профиля
  imageFromProvider: boolean;
  person: {
    firstName: string;
    patronymic: string;
    lastName: string;
    birthday: string;
    gender: 'male' | 'female';
    bio: string;
  };
  city?: string;
  phone?: string;
  team?: {
    id: number; // id номер, присваиваемый автоматически при регистрации
    name: string;
  };
  role: ObjectId;
  social: {
    telegram?: string;
    vk?: string;
    youtube?: string;
    komoot?: string;
    strava?: string;
    whatsapp?: string;
    garminConnect?: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
/**
 * Автор поста для публичного доступа, получаемый из модели User путем проекции документа при запросе из БД.
 */
export type TAuthorFromUser = {
  _id: ObjectId;
  id: number;
  provider: {
    image?: string;
  };
  imageFromProvider: boolean;
  image?: string;
  person: {
    firstName: string;
    lastName: string;
  };
};
/**
 * Типы модели подтверждения email.
 */
export interface IUserConfirm {
  userId: string;
  date: number;
  activationToken: string;
  email: string;
}
/**
 * Типы модели сброса пароля.
 */
export interface IPasswordReset {
  userId: string;
  date: number;
  tokenReset: string;
  email: string;
}

/**
 * Типы модели счетчика id для сущностей name.
 */
export type CounterModel = {
  name: string;
  sequenceValue: number;
};

/**
 * Типы модели новости.
 */
export type TNews = {
  _id: ObjectId;
  title: string;
  urlSlug: string;
  subTitle: string;
  blocks: TNewsBlockInfo[];
  content: string;
  author: ObjectId;
  poster: string;
  hashtags: string[];
  viewsCount: number; // Счетчик просмотров
  likesCount: number; // Счетчик лайков
  sharesCount: number; // Счетчик шеров
  likedBy: ObjectId[]; // Массив идентификаторов пользователей, которые лайкнули
  important: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Типы модели блока новости и маршрута.
 */
export type TNewsBlockInfo = {
  _id: ObjectId;
  text: string; // Текст блока.
  image?: string | null; // Ссылка на изображение (в облаке).
  imageTitle: string; // Заголовок(подпись) изображения.
  position: number; // Порядковый номер блока.
  title?: string; // Заголовок блока
  video?: string; // Ссылка на видео с Youtube.
};

/**
 * Типы модели блока новости.
 */
export type TRoleModel = {
  _id: ObjectId;
  name: string;
  description?: string;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Типы модели возрастной категории.
 */
export type TAgeCategory = {
  _id: ObjectId;
  version: string; // Название версии разделения по возрастным категориям.
  description?: String; // Описание версии деления по категориям.
  name: string; // Название категории.
  age: {
    min: number; // Минимальное количество лет в категории (включительно).
    max: number; // Максимальное количество лет в категории (включительно).
  };
  gender: 'male' | 'female';
  createdAt?: Date;
  updatedAt?: Date;
};

export interface TLogsErrorModel {
  _id: ObjectId;
  type?: string; // тип ошибки
  message: string; // краткое описание
  stack?: string; // стэк ошибки
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Типизация документа Trail из mongoDB.
 */
export type TTrailDocument = Document & TTrail;

export type TTrail = {
  title: string; // Название маршрута
  poster: string; // ССылка на изображение обложки Маршрута.
  urlSlug: string; // Последняя часть url страницы с маршрутом.
  region: string; // Регион в котором проходит маршрут.
  bikeType: 'road' | 'mtb' | 'gravel' | 'dh'; // Тип велосипеда для маршрута.
  startLocation: string; // Город или место у которого есть название.
  turnLocation?: string; // Город или место у которого есть название.
  finishLocation: string; // Город или место у которого есть название.
  distance: number; // Расстояние в километрах.
  ascent: number; // Набор высоты в метрах.
  blocks: TNewsBlockInfo[];
  garminConnect?: string;
  komoot?: string;
  author: ObjectId;
  // comments: ObjectId[];
  likedBy: ObjectId[];
  count: {
    views: number;
    likes: number;
    shares: number;
  }; // Счетчики.
  difficultyLevel: 'Лёгкий' | 'Средний' | 'Сложный';
  rating?: number; // Поле для рейтинга маршрута.
  hashtags?: string[];
  isApproved: boolean; // Прошел ли проверку модератора.
  trackGPX: string; // Файл трэка gps в формате GPX.
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Событие в Календаре.
 */
export type TCalendarEventDocument = Document &
  Omit<TFormCalendar, 'date'> & { date: Date; author: ObjectId };
