import {
  TDistanceStatsForClient,
  TGender,
  TOrganizerForClient,
  TParentChampionshipForClient,
  TRaceForForm,
  TResultRaceFromDB,
  TStageDateDescription,
} from './index.interface';
import {
  IUserModel,
  TAuthorFromUser,
  TCategories,
  TChampionship,
  TChampionshipTypes,
  TDisqualification,
  TDistance,
  TDistanceResult,
  TGap,
  TGeneralClassification,
  TLogsErrorModel,
  TModeratorActionLog,
  TNewsBlockInfo,
  TOrganizer,
  TPaymentNotification,
  TProfileRiderInProtocol,
  TQuantityRidersFinished,
  TRace,
  TRacePointsTable,
  TRaceRegistrationStatus,
  TRoleModel,
  TSiteServicePrice,
  TStageInGC,
  TTrail,
} from './models.interface';
import {
  TGetAllModeratorActionLogsFromMongo,
  TGetToursAndSeriesFromMongo,
} from './mongo.types';

/**
 * Одна новость с сервера.
 */
export type TNewsGetOneDto = {
  _id: string;
  title: string;
  urlSlug: string;
  subTitle: string;
  blocks: TNewsBlockDto[];
  content: string;
  poster: string;
  hashtags: string[];
  viewsCount: number; // Счетчик просмотров
  likesCount: number; // Счетчик лайков
  commentsCount: number; // Счетчик комментариев.
  sharesCount: number; // Счетчик шеров
  createdAt: Date;
  updatedAt: Date;
  author: TAuthor;
  isLikedByUser: boolean;
  important: boolean;
  filePdf?: string;
};

/**
 * Дто автора поста для публичного доступа. !!! Изменить название с обозначением Dto.
 */
export type TAuthor = Omit<TAuthorFromUser, '_id'> & { _id: string };

// Блок новости без _id.
export type TNewsBlockDto = Omit<TNewsBlockInfo, '_id'>;

// Интерактивный блок новостей
export type TNewsInteractiveDto = {
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
};

/**
 * Типы модели блока новости.
 */
export type TRoleDto = Omit<TRoleModel, '_id'> & { _id: string };

/**
 * Лог ошибки на сервере (фронте).
 */
export type TGetErrorsDto = Omit<TLogsErrorModel, '_id'> & { id: number; _id: string };

/**
 * Профиль пользователя, получаемый с сервера на клиент.
 */
export type TUserDto = Omit<IUserModel, '_id' | 'role' | 'credentials'> & {
  _id: string;
  role: TRoleDto;
  credentials: {
    username: string;
  } | null;
};

/**
 * Профиль пользователя, получаемый с сервера на клиент (Публичный).
 */
export type TUserDtoPublic = Omit<TUserDto, 'provider' | 'email' | 'person'> & {
  provider: {
    name: string;
    image?: string;
  } | null;
  person: {
    firstName: string;
    patronymic?: string;
    lastName: string;
    ageCategory: string | null; //  ageCategory деление по 10 лет
    gender: 'male' | 'female';
    bio: string;
    yearBirthday: number;
  };
};

export type TBlockTrailDto = Omit<TNewsBlockInfo, '_id'> & { _id: string };

export type TTrailDto = Omit<TTrail, '_id' | 'author' | 'comments' | 'blocks' | 'likedBy'> & {
  _id: string;
  blocks: TBlockTrailDto[];
  commentsCount: number;
  isLikedByUser: boolean;
  author: TAuthor;
  moderatorIds: string[];
};

/**
 * Событие календаря для клиента.
 */
export type TDtoCalendarEvents = {
  _id: string;
  id: number;
  title: string;
  date: string;
  urlSlug: string;
  bikeType: string;
  author: string;
};

/**
 * ДТО для Организатора.
 */
export type TDtoOrganizer = Omit<
  TOrganizer,
  'creator' | '_id' | 'createdAt' | 'updatedAt' | 'moderators'
> & {
  _id: string;
  creator: TAuthor;
  createdAt: string;
  updatedAt: string;
};

/**
 * ДТО для Чемпионата.
 */
export type TDtoChampionship = Omit<
  TChampionship,
  | 'organizer'
  | '_id'
  | 'startDate'
  | 'endDate'
  | 'createdAt'
  | 'updatedAt'
  | 'parentChampionship'
  | 'races'
  | 'categoriesConfigs'
  | 'categoriesConfigs'
  | 'racePointsTable'
> & {
  _id: string;
  organizer: TOrganizerForClient;
  parentChampionship?: TParentChampionshipForClient;
  racePointsTable: TRacePointsTableDto | null;
  startDate: string;
  endDate: string;
  stageDateDescription: TStageDateDescription[];
  createdAt: string;
  updatedAt: string;
  races: TRaceForForm[];
  categoriesConfigs: (Omit<TCategories, '_id' | 'championship'> & { _id: string })[];
};

/**
 * Dto Комментарий для новости, маршрута и т.д.
 */
export type TCommentDto = {
  _id: string;
  text: string; // Текст комментария.
  author: TAuthor; // Данные об авторе комментария.
  count: {
    likes: number; // Общее количество лайков у комментария.
  };
  isLikedByUser: boolean; // Пользователь, просматривающий комментарий, ставил лайк данному комментарию?
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Dto Разрешения (доступа) к ресурсам сайта.
 */
export type TPermissionDto = {
  _id: string;
  name: string;
  description: string;
};

/**
 * Тип, описывающий данные зарегистрированного райдера в Заезде.
 */
export type TRaceRegistrationDto = {
  _id: string; // Ссылка _id на документ RaceRegistration в строковом формате.
  championship: string; // Ссылка _id нЧемпионат.
  raceId: string;
  rider: TRaceRegistrationRiderDto;
  category: string; // Название возрастной или sillLevel категории.
  startNumber: number | undefined; // Номер участника на старте.
  status: TRaceRegistrationStatus; // Статус регистрации.
  createdAt: string; // Дата создания в формате ISO 8601.
};
export type TRaceRegistrationRiderDto = {
  _id: string; // Ссылка _id на документ User в строковом формате.
  id: number; // id Райдера на сайте.
  firstName: string; // Имя райдера.
  lastName: string; // Фамилия райдера.
  patronymic?: string; // Отчество райдера.
  gender: 'male' | 'female'; // Пол райдера.
  fullYears: number; // Полные годы райдера.
  fractionalYears: number; // Неполные годы райдера.
  yearBirthday: number; // Год рождения райдера.
  team?: string; // Команда райдера.
  city?: string; // Город райдера.
  image?: string; // Лого райдера.
};

/**
 * Массив Заездов из Чемпионата с зарегистрированными райдерами.
 */
export type TChampRegistrationRiderDto = {
  raceId: string;
  raceName: string;
  raceRegistrationRider: TRaceRegistrationDto[];
};

/**
 * Массив Заездов из Чемпионата с зарегистрированными райдерами.
 */
export type TRegistrationRiderDto = {
  _id: string;
  rider: { gender: TGender };
  championship: {
    _id: string;
    name: string;
    urlSlug: string;
    startDate: Date;
    endDate: Date;
    status: 'upcoming';
    type: TChampionshipTypes;
    race: TRaceForForm;
    posterUrl: string;
  };
  parentChampionship: { name: string; urlSlug: string; type: TChampionshipTypes } | null;
  startNumber: number;
  status: TRaceRegistrationStatus;
  createdAt: Date;
};

/**
 * Проверка активной регистрации райдера в запрашиваемом Чемпионате во всех заездах.
 */
export type TCheckRegisteredInChampDto = {
  race: {
    number: number;
    name: string;
    description: string;
    laps: number;
    distance: number;
    ascent: number | undefined;
  };
  startNumber: number;
};

/**
 * Данные DTO профиля минимальным количеством данных.
 */
export type TProfileSimpleDto = {
  _id: string;
  id: number;
  firstName: string;
  lastName: string;
  patronymic?: string;
  yearBirthday: number;
  gender: 'male' | 'female';
  city?: string;
};

/**
 * Данные DTO результата райдера в заезде чемпионата.
 */
export type TResultRaceDto = Omit<
  TResultRaceFromDB,
  '_id' | 'creator' | 'createdAt' | 'updatedAt' | 'championship' | 'race'
> & {
  _id: string;
  race: string;
  creator: string;
  championship: string;
  createdAt: number;
  updatedAt: number;
};

/**
 * Данные DTO результата райдера в заезде чемпионата.
 */
export type TRiderRaceResultDto = {
  _id: string;
  profile: TProfileRiderInProtocol;
  startNumber: number;
  raceTimeInMilliseconds: number;
  positions: {
    category: number;
    absolute: number;
    absoluteGender: number;
    manual?: number;
  };
  quantityRidersFinished: TQuantityRidersFinished;
  points: any;
  disqualification?: TDisqualification;
  categoryAge: string;
  categorySkillLevel: string | null;
  averageSpeed?: number;
  lapTimes?: number[];
  remarks?: string;
  championship: {
    name: string;
    urlSlug: string;
    endDate: number;
  };
  race: Pick<TRace, 'ascent' | 'description' | 'distance' | 'laps' | 'name' | 'number'>;
  categoriesConfig: Omit<TCategories, '_id' | 'championship'> & {
    _id: string;
  };
};

export type TToursAndSeriesDto = Omit<
  TGetToursAndSeriesFromMongo,
  '_id' | 'startDate' | 'endDate'
> & {
  _id: string;
  startDate: string;
  endDate: string;
  availableStage: number[];
};

export type TRacePointsTableDto = Omit<
  TRacePointsTable,
  '_id' | 'organizer' | 'createdAt' | 'updatedAt'
> & {
  _id: string;
  organizer: string;
  createdAt: string;
  updatedAt: string;
};

export type TGeneralClassificationDto = Omit<
  TGeneralClassification,
  '_id' | 'championship' | 'rider' | 'createdAt' | 'updatedAt' | 'stages'
> & {
  _id: string;
  championship: string;
  rider: {
    id: number;
    image?: string;
    provider?: { image?: string };
    imageFromProvider: boolean;
  };
  createdAt: string;
  updatedAt: string;
  stages: TStageClient[];
};
export type TStageClient = Omit<TStageInGC, 'championship'> & { championship: string };

export type TGetByIdModeratorActionLogDto = Omit<
  TModeratorActionLog,
  '_id' | 'moderator' | 'timestamp'
> & {
  _id: string;
  moderator: {
    _id: string;
    person: {
      firstName: string;
      lastName: string;
    };
  };
  timestamp: string;
};

export type TGetModeratorActionLogDto = Omit<
  TGetAllModeratorActionLogsFromMongo,
  '_id' | 'moderator' | 'timestamp'
> & {
  _id: string;
  moderator: {
    _id: string;
    image: IUserModel['image'];
    imageFromProvider: IUserModel['imageFromProvider'];
    person: Pick<IUserModel['person'], 'lastName' | 'firstName'>;
    role: { name: string };
    provider: {
      image?: string;
    };
  };
  timestamp: string;
};

export type TDistanceDto = Omit<
  TDistance,
  '_id' | 'creator' | 'stats' | 'updatedAt' | 'createdAt'
> & {
  _id: string;
  creator: string;
  stats?: TDistanceStatsForClient;
  updatedAt: string;
  createdAt: string;
};

export type TDistanceResultDto = Omit<
  TDistanceResult,
  | '_id'
  | 'championship'
  | 'trackDistance'
  | 'raceResult'
  | 'rider'
  | 'createdAt'
  | 'updatedAt'
  | 'positions'
> & {
  _id: string;
  startDate: string; // Из документа championship.
  championshipUrlSlug: string; // Из документа championship.
  trackDistance: string;
  raceResult: string;
  rider: TRiderForDistanceResultDto;
  position: number;
  currentGaps: TGap;
  createdAt: string;
  updatedAt: string;
};
export type TRiderForDistanceResultDto = {
  id: number;
  firstName: string;
  lastName: string;
  patronymic?: string;
  gender: TGender;
  image?: string;
};
export type TPaymentNotificationDto = Omit<
  TPaymentNotification,
  '_id' | 'user' | 'createdAt' | 'capturedAt'
> & {
  _id: string;
  user: string;
  createdAt: string;
  capturedAt?: string;
};
export type TSiteServicePriceDto = Omit<TSiteServicePrice, '_id'> & { _id: string };
