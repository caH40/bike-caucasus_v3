import {
  TOrganizerForClient,
  TParentChampionshipForClient,
  TRaceClient,
  TStageDateDescription,
} from './index.interface';
import {
  IUserModel,
  TAuthorFromUser,
  TChampionship,
  TChampionshipTypes,
  TLogsErrorModel,
  TNewsBlockInfo,
  TOrganizer,
  TRaceRegistrationStatus,
  TRoleModel,
  TTrail,
} from './models.interface';

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
    patronymic: string;
    lastName: string;
    ageCategory: string | null; // birthday заменён на ageCategory
    gender: 'male' | 'female';
    bio: string;
  };
};

export type TBlockTrailDto = Omit<TNewsBlockInfo, '_id'> & { _id: string };

export type TTrailDto = Omit<TTrail, '_id' | 'author' | 'comments' | 'blocks' | 'likedBy'> & {
  _id: string;
  blocks: TBlockTrailDto[];
  commentsCount: number;
  isLikedByUser: boolean;
  author: TAuthor;
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
export type TDtoOrganizer = Omit<TOrganizer, 'creator' | '_id' | 'createdAt' | 'updatedAt'> & {
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
> & {
  _id: string;
  organizer: TOrganizerForClient;
  parentChampionship?: TParentChampionshipForClient;
  startDate: string;
  endDate: string;
  stageDateDescription: TStageDateDescription[];
  createdAt: string;
  updatedAt: string;
  races: TRaceClient[];
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
  raceNumber: number; // Номер заезда.
  rider: TRaceRegistrationRiderDto;
  startNumber: number | undefined; // Номер участника на старте.
  status: TRaceRegistrationStatus; // Статус регистрации.
  createdAt: string; // Дата создания в формате ISO 8601.
};
export type TRaceRegistrationRiderDto = {
  _id: string; // Ссылка _id на документ User в строковом формате.
  id: number; // id Райдера на сайте.
  firstName: string; // Имя райдера.
  lastName: string; // Фамилия райдера.
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
  raceNumber: number;
  raceName: string;
  raceRegistrationRider: TRaceRegistrationDto[];
};

/**
 * Массив Заездов из Чемпионата с зарегистрированными райдерами.
 */
export type TRegistrationRiderDto = {
  _id: string;
  riderId: string;
  championship: {
    _id: string;
    name: string;
    urlSlug: string;
    startDate: Date;
    endDate: Date;
    status: 'upcoming';
    type: TChampionshipTypes;
    race: TRaceClient;
    posterUrl: string;
  };
  parentChampionship: { name: string; urlSlug: string; type: TChampionshipTypes } | null;
  raceNumber: number;
  startNumber: number;
  status: TRaceRegistrationStatus;
  createdAt: Date;
};
