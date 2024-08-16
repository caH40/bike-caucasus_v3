import mongoose, { Document, ObjectId } from 'mongoose';
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
  comments: mongoose.Types.ObjectId[]; // Массив комментариев.
  important: boolean;
  filePdf?: string; // URL на файл pdf(например протокол).
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
  blocks: {
    _id: ObjectId;
    text: string; // Текст блока.
    image?: string | null; // Ссылка на изображение (в облаке).
    imageTitle: string; // Заголовок(подпись) изображения.
    position: number; // Порядковый номер блока.
    title?: string; // Заголовок блока
    video?: string; // Ссылка на видео с Youtube.
  }[];
  garminConnect?: string;
  komoot?: string;
  author: ObjectId;
  // comments: ObjectId[];
  likedBy: mongoose.Types.ObjectId[];
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

/**
 * Комментарий для новости, маршрута и т.д.
 */
export type TCommentDocument = Document & TComment;
export type TComment = {
  _id: mongoose.Types.ObjectId;
  text: string;
  author: mongoose.Types.ObjectId;
  likedBy: mongoose.Types.ObjectId[];
  document: {
    _id: string;
    type: string;
  };
  count: {
    likes: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Разрешения, доступные пользователям, назначаемые админом.
 */
export type TPermissionDocument = Document & TPermission;
export type TPermission = {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
};

// Типы для контактной информации.
export type OrganizerContactInfo = {
  email: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    vk?: string;
    telegram?: string;
    telegramGroup?: string;
  };
};
// Тип для адреса.
export type OrganizerAddress = {
  city: string;
  state?: string;
  country?: string;
};
// Тип для оплаты за создание чемпионата.
type ChampionshipCreationFee = {
  amount: number;
  method?: string; // Метод оплаты (например, "credit card", "bank transfer")
};
/**
 * Тип схемы/модели для Организатора Чемпионатов.
 */
export type TOrganizerDocument = Document & TOrganizer;
export type TOrganizer = {
  _id: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  urlSlug: string;
  name: string;
  description: string;
  logoUrl: string; // Лого клуба.
  posterUrl: string; // Постер для страницы клуба.
  contactInfo: OrganizerContactInfo;
  address: OrganizerAddress;
  championshipCreationFee: ChampionshipCreationFee;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Тип схемы/модели для Чемпионата.
 */
export type TChampionshipDocument = TChampionship & Document;
export type TChampionship = {
  _id: mongoose.Types.ObjectId;
  name: string; // Название чемпионата.
  urlSlug: string; // Уникальный url страницы чемпионата.
  description: string; // Описание, включая карту с местом старта.
  organizer: mongoose.Types.ObjectId; // Ссылка на объект Организатора.
  type: 'tour' | 'series' | 'single' | 'stage';
  quantityStages: number | null; // Количество этапов.
  parentChampionship: mongoose.Types.ObjectId | null; // Ссылка на родительскую страницу чемпионата, если это этап.
  stage: number | null; // Номер этапа, если это этап.
  startDate: Date; // Дата начала чемпионата.
  endDate: Date; // Дата окончания чемпионата.
  trackGPX?: TTrackGPXObj;
  posterUrl: string; // Постер для страницы Чемпионата.
  status: TChampionshipStatus; // Статус чемпионата.
  // Тип чемпионата (например, Тур, Серия заездов, Отдельный заезд).
  // single Соревнование с одним этапом.
  // series Соревнование несколькими этапами, за которые начисляются очки, в конце серии подводятся
  // результаты, суммируя очки за все или определенные этапы.
  // tour Соревнование в котором несколько этапов и суммируется время каждого этапа, выигрывает Тур .
  // тот у кого общее время за все этапы будет минимальным.
  // stage - этап в Туре или Серии, имеет свойство stage и ссылку на родительский чемпионат.
  bikeType: 'tt' | 'road' | 'mtb' | 'gravel' | 'downhill' | 'timeTrial'; // Тип используемого велосипеда (например, ТТ, горный, шоссейный, даунхильный).
  createdAt: Date;
  updatedAt: Date;
};
export type TTrackGPXObj = {
  url: string; // URL трек заезда в облаке.
  coordStart: { lat: number; lon: number }; // Координаты старта заезда.
};
export type TChampionshipStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
