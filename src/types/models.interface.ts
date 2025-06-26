import mongoose, { Document, ObjectId, Types } from 'mongoose';
import {
  TAwardedProtocols,
  TCategoryAge,
  TCategorySkillLevel,
  TDeviceInfo,
  TFormCalendar,
  TLocationInfo,
  TrackData,
  TServiceEntity,
  TSurfaceType,
} from './index.interface';

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
  person: TPerson;
  city?: string;
  phone?: string;
  team?: {
    id: number; // id номер, присваиваемый автоматически при регистрации
    name: string;
  };
  role: ObjectId;
  social: TSocial;
  preferences: TUserPreferences;
  createdAt: Date;
  updatedAt: Date;
};
export type TPerson = {
  firstName: string;
  patronymic?: string;
  lastName: string;
  birthday: Date;
  gender: 'male' | 'female';
  bio: string;
};
export type TSocial = {
  telegram?: string;
  vk?: string;
  youtube?: string;
  komoot?: string;
  strava?: string;
  whatsapp?: string;
  garminConnect?: string;
};
export type TUserPreferences = {
  showPatronymic?: boolean; // Отображать отчество при показе полного имени.
  notification?: {
    development: boolean; // Оповещения на email об изменениях на сайте.
    events: boolean; // Оповещения на email о новых мероприятиях.
    news: boolean; // Оповещения на email о новостях.
  };
  theme?: 'light' | 'dark'; // Тема интерфейса пользователя.
  language?: string; // Язык интерфейса, например 'ru', 'en'.
  privacy?: {
    profileVisible: boolean; // Видимость профиля другим пользователям.
    showEmail: boolean; // Отображать ли email публично.
    showPhone: boolean; // Отображать ли телефон публично.
  };
  display?: {
    showAvatars: boolean; // Показывать аватары пользователей.
    itemsPerPage: number; // Количество элементов на странице в списках.
  };
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
    patronymic?: string;
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
  _id: mongoose.Types.ObjectId;
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
  moderators: mongoose.Types.ObjectId[]; // Список модераторов, которые могут создавать и редактировать чемпионаты от имени данного организатора.
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
  type: TChampionshipTypes;
  quantityStages: number | null; // Количество этапов.
  awardedProtocols: TAwardedProtocols; // По каким протоколам будет награждение (идёт зачет в ГК).

  isCountedStageInGC: boolean; // Включать ли этап в генеральную классификацию.
  requiredStage: boolean; // Обязателен ли данный этап для ГК. (Если true, то при пропуске участник получает дисквалификацию в ГК.)
  stageOrder: number | null; // Номер этапа, если это этап.
  parentChampionship: mongoose.Types.ObjectId | null; // Ссылка на родительскую страницу чемпионата, если это этап.
  racePointsTable: mongoose.Types.ObjectId | null; // Ссылка на таблицу начисления очков на этапах, если это родительский Чемпионат (series, tour)
  startNumbers: {
    start: number; // Начало нумерации стартового номера (включительно).
    end: number; // Конец нумерации стартового номера (включительно).
  };
  startDate: Date; // Дата начала чемпионата.
  endDate: Date; // Дата окончания чемпионата.
  races: mongoose.Types.ObjectId[];
  posterUrl: string; // Постер для страницы Чемпионата.
  status: TChampionshipStatus; // Статус чемпионата.
  categoriesConfigs: mongoose.Types.ObjectId[];
  bikeType: 'tt' | 'road' | 'mtb' | 'gravel' | 'downhill' | 'timeTrial'; // Тип используемого велосипеда (например, ТТ, горный, шоссейный, даунхильный).
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Типы Чемпионатов.
 */
export type TChampionshipTypes = 'tour' | 'series' | 'single' | 'stage';
// Тип чемпионата (например, Тур, Серия заездов, Отдельный заезд).
// single Соревнование с одним этапом.
// series Соревнование несколькими этапами, за которые начисляются очки, в конце серии подводятся
// результаты, суммируя очки за все или определенные этапы.
// tour Соревнование в котором несколько этапов и суммируется время каждого этапа, выигрывает Тур .
// тот у кого общее время за все этапы будет минимальным.
// stage - этап в Туре или Серии, имеет свойство stage и ссылку на родительский чемпионат.
export type TTrackGPXObj = {
  url: string; // URL трек заезда в облаке.
  coordStart: { lat: number; lon: number }; // Координаты старта заезда.
};
export type TChampionshipStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

/**
 * Тип схемы/модели для Заезда Чемпионата.
 * Закрывается после завершения Этапа/Соревнования, где использовался Заезд.
 * В последующем можно дублировать, для использования в другом Этапе/Соревновании.
 */
export type TRace = {
  _id: Types.ObjectId;
  championship: Types.ObjectId; // _id чемпионата к которому принадлежит заезд.
  number: number; // Порядковый номер.
  name: string; // Должно быть уникальным в рамках одного Соревнования/Этапа.
  description: string; // Краткие детали Заезда.
  laps: number; // Количество кругов.
  distance: number; // Дистанция Заезда в километрах.
  ascent?: number; // Набор высоты на дистанции в метрах.
  trackGPX: TTrackGPXObj; // Трек для дистанции обязателен.
  registeredRiders: Types.ObjectId[]; // Массив ссылок на зарегистрированных райдеров в заезде.
  categories: Types.ObjectId; // _id Пакета категорий для заезда.
  quantityRidersFinished: number; // Общее количество финишировавших.
};
export type TRaceDocument = Omit<TRace, '_id'> & Document;

/**
 * Тип схемы регистрация Райдера (User) на Заезд Чемпионата.
 */
export type TPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'free';
export type TPaymentMethod = 'card' | 'paymentSystem' | 'cash';
export type TRaceRegistrationStatus = 'registered' | 'canceled' | 'banned';
export type TRaceRegistrationDocument = TRaceRegistration & Document;
export type TRaceRegistration = {
  _id: mongoose.Types.ObjectId; // Идентификатор документа в коллекции.
  championship: mongoose.Types.ObjectId; // Ссылка на чемпионат.
  race: mongoose.Types.ObjectId; // Ссылка на заезд.
  categorySkillLevel: string | null; // Название выбранной категории скила, берётся из настроек Чемпионата. Если не указана, значит деление по возрасту.
  rider: mongoose.Types.ObjectId; // Ссылка на Юзера.
  startNumber: number; // Номер участника на старте.
  team?: mongoose.Types.ObjectId; // Ссылка на Команду
  teamVariable?: string; // Название команды, вводится в форме регистрации, если нет team.
  status: TRaceRegistrationStatus; // Статус регистрации. При отмене Документ не удаляется а устанавливается флаг canceled.
  payment: {
    method: TPaymentMethod; // Метод оплаты.
    status: TPaymentStatus; // Статус оплаты регистрации.
    comment?: string; // Комментарий к платежу (например, детали ошибки или прочее).
  };
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Протокол (абсолют) заезда в Чемпионате.
 */
export type TResultRaceDocument = TResultRace & Document;
export type TResultRace = {
  _id: mongoose.Types.ObjectId; // Идентификатор документа в коллекции.
  championship: mongoose.Types.ObjectId; // Ссылка на чемпионат.
  race: mongoose.Types.ObjectId; // Ссылка на заезд.
  rider?: mongoose.Types.ObjectId; // Ссылка на пользователя, есть он есть в БД.
  profile: TProfileRiderInProtocol;
  startNumber: number;
  raceTimeInMilliseconds: number; // Время заезда (миллисекундах).
  positions: TPositions; // Занятые места во всех протоколах.
  points: TPoints | null;
  disqualification?: TDisqualification; // Дисквалификация райдера в заезде.
  categoryAge: string; // Выставляется автоматически при запуске расчета.
  categorySkillLevel: string | null; // Выставляется вручную. Ручное деление по мастерству (Профики, элита, А ...). Если существует, значит деление по категориям согласно categorySkillLevel, а не по возрасту.
  averageSpeed?: number; // Средняя скорость райдера в заезде (в км/ч).
  lapTimes?: number[]; // Время, затраченное на каждый круг (массив времен в миллисекундах).
  remarks?: string; // Примечания или комментарии.
  creator: mongoose.Types.ObjectId; // Ссылка на Пользователя, добавившего результат.
  quantityRidersFinished: TQuantityRidersFinished; // Количество райдеров по категориям. Возрастные категории для каждого чемпионата уникальные и могут изменяться, поэтому данная сущность хранится в результате райдера, а не в сущности чемпионата.
  gapsInCategories: TGapsInCategories; // Гэпы до лидера и до предыдущего райдера для каждой категории.
  createdAt: Date;
  updatedAt: Date;
};
export type TPositions = {
  category: number; // Позиция в возрастной категории или по уровню подготовки. Подразумевается, что используется деление или по возрасту, или по подготовке.!!!
  absolute: number; // Абсолютная категория.
  absoluteGender: number; // Абсолютная категория с делением по полу муж/жен.
};
export type TPoints = {
  category: number; // Заработанные очки в заезде в возрастной или спецкатегории в зависимости, где райдер участвует.
  absolute: number; // Начисление очков для абсолютного протокола.
  absoluteGender: number; // Начисление очков для абсолютного протокола.
};
export type TQuantityRidersFinished = {
  category: number; // Позиция в возрастной категории или по уровню подготовки. Подразумевается, что используется деление или по возрасту, или по подготовке.!!!
  absolute: number; // Абсолютная категория.
  absoluteGenderMale: number; // Абсолютная категория с делением по полу муж/жен.
  absoluteGenderFemale: number; // Позиция райдера в заезде, выставляется вручную. !В разработке.
};
export type TDisqualification = {
  type: 'DNF' | 'DSQ' | 'DNS'; // Не завершил заезд (Did Not Finish). Дисквалифицирован. Не стартовал (Did Not Start)
  comment?: string;
};
export type TProfileRiderInProtocol = {
  firstName: string; // Имя райдера.
  lastName: string; // Фамилия райдера.
  patronymic?: string; // Фамилия райдера.
  team?: string; // Команда райдера, если известно.
  city: string; // Город райдера, если известно.
  yearBirthday: number; // Год рождения.
  gender: 'male' | 'female';
};
export type TGapsInCategories = {
  category: TGap | null;
  absolute: TGap | null;
  absoluteGenderMale: TGap | null;
  absoluteGenderFemale: TGap | null;
};
export type TGap = { toLeader: number | null; toPrev: number | null }; // null если райдер является лидером и никого нет впереди.

/**
 * Возрастные и уровневые категории, которые могут быть использованы в чемпионате.
 * Каждый набор имеет уникальное имя, по которому будет ссылаться заезд.
 */
export type TCategories = {
  _id?: Types.ObjectId;
  championship: Types.ObjectId;
  name: string; // Название пакета категорий для чемпионата, может быть несколько в чемпионате, для разных заездов.
  description?: string;
  // Наборы возрастных категорий, делятся по полу.
  age: {
    female: TCategoryAge[]; // Женские возрастные категории.
    male: TCategoryAge[]; // Мужские возрастные категории.
  };
  // Наборы категорий по уровню подготовки (буквенные категории: A, B, C, Pro и т.п.)
  skillLevel?: {
    female: TCategorySkillLevel[]; // Женские категории по уровню подготовки.
    male: TCategorySkillLevel[]; // Мужские категории по уровню подготовки.
  };
};

/**
 * Правило начисления очков за конкретное место.
 */
export type TRacePointsRule = {
  place: number; // Место в финишном протоколе (1, 2, 3 и т.д.).
  points: number; // Количество начисляемых очков за указанное место.
};
/**
 * Таблица начисления очков, используемая организаторами гонок.
 */
export type TRacePointsTableDocument = TRacePointsTable & Document;
export type TRacePointsTable = {
  _id: Types.ObjectId; // Уникальный идентификатор таблицы (автоматически создаётся Mongoose).
  name: string; // Название таблицы (например, "Zwift Power Standard").
  organizer: Types.ObjectId; // Ссылка на _id организатора, который создал эту таблицу.
  description?: string; // (Опционально) описание таблицы и принципов начисления очков.
  rules: TRacePointsRule[]; // Массив правил начисления очков, в порядке мест.
  fallbackPoints?: number; // Очки для всех мест, не указанных в rules
  isDefault: boolean; // Если true — таблица доступна всем организаторам.
  createdAt: Date; // Дата создания таблицы.
  updatedAt: Date; // Дата последнего обновления таблицы.
};

/**
 * Тип, описывающий запись в генеральной классификации тура (Tour GC) для MongoDB.
 * Хранит информацию о позиции райдера в серии заездов, общем времени, статусе дисквалификации
 * и результатах по каждому этапу.
 */
export type TGeneralClassificationDocument = TGeneralClassification & Document;
export type TGeneralClassification = {
  _id: Types.ObjectId; // MongoDB ID (опционально, если документ ещё не создан).
  championship: mongoose.Types.ObjectId; // Ссылка на чемпионат (Серия или Тур).
  rider?: mongoose.Types.ObjectId; // Ссылка на пользователя, есть он есть в БД.
  profile: TProfileRiderInProtocol;
  categoryAge: string;
  categorySkillLevel: string | null; // Спецкатегории.
  team: Types.ObjectId | null; // Опционально: состав команды в рамках серии.

  // Расчетные данные:
  completedStages: number; // Количество завершённых этапов.
  disqualification: TDisqualification | null; // Статус дисквалификации.
  gapsInCategories: TGapsInCategories; // Финишные гэпы для категорий и для абсолюта.
  positions: TPositions; // Позиции райдера в протоколах в  генеральной классификации.
  totalFinishPoints: TPoints | null; // Суммарные очки (для серии с подсчётом очков).
  totalTimeInMilliseconds: number; // Общее время за все завершённые этапы (в миллисекундах).
  stages: TStageInGC[];
  createdAt: Date;
  updatedAt: Date;
};

export type TStageInGC = {
  championship: mongoose.Types.ObjectId; // Ссылка на этап в БД.
  order: number; // Порядковый номер этапа в туре.
  name: string; // Название этапа.
  urlSlug: string;
  durationInMilliseconds: number | null; // Время прохождения этапа (в миллисекундах). null, если этап не был пройден.
  points: TPoints | null; // Заработанные финишные очки за этап. null в Туре.
  positions: TPositions; // Места в разных протоколах на этапе.
};

/**
 * Логирование действий модераторов.
 */
export type TModeratorActionLogDocument = TModeratorActionLog & Document;
export type TModeratorActionLog = {
  _id: mongoose.Types.ObjectId; // Уникальный идентификатор записи.
  moderator: mongoose.Types.ObjectId; // ID модератора, выполнившего действие.
  entity: TServiceEntity; // Название сущности, над которой было выполнено действие.
  entityIds: string[]; // ID изменённой сущности.
  action: 'create' | 'update' | 'delete'; // Тип действия: создание, обновление или удаление.
  changes?: Record<string, any> & { description?: string }; // Объект с изменениями: новые или изменённые значения.
  timestamp: Date; // Дата и время выполнения действия.
  client?: {
    deviceInfo?: TDeviceInfo;
    location?: TLocationInfo;
  }; // Информация о клиенте, с которого было выполнено действие.
};

/**
 * Дистанция для заездов.
 */
export type TDistanceDocument = TDistance & Document;
export type TDistance = {
  _id: mongoose.Types.ObjectId; // Уникальный идентификатор дистанции.
  creator: mongoose.Types.ObjectId; // Идентификатор пользователя, создавшего маршрут.
  name: string; // Название маршрута.
  description?: string; // Описание маршрута.
  trackGPX: TTrackGPXObj; // Объект с GPX-данными маршрута.
  distanceInMeter: number; // Общая длина маршрута в метрах.
  ascentInMeter: number; // Общий набор высоты в метрах.
  avgGrade: number; // Средний градиент (в процентах).
  lowestElev: number; // Минимальная высота на маршруте (в метрах).
  highestElev: number; // Максимальная высота на маршруте (в метрах).
  surfaceType?: TSurfaceType; // Тип покрытия маршрута.
  isPublic: boolean; // Публичная ли дистанция.
  isElevationProfileReady: boolean; // Профиль высоты рассчитан и есть БД.
  elevationProfile?: TrackData; // Профиль высоты (если требуется для графиков).
  createdAt: Date; // Дата создания записи.
  updatedAt: Date; // Дата последнего изменения.
};
