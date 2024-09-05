import type { UseFormRegisterReturn } from 'react-hook-form';
import {
  TChampionship,
  TChampionshipStatus,
  TChampionshipTypes,
  TLogsErrorModel,
  TNewsBlockInfo,
  TOrganizer,
  TRace,
  TRaceRegistrationStatus,
  TTrackGPXObj,
} from './models.interface';
import { Dispatch, LegacyRef, SetStateAction } from 'react';
import mongoose from 'mongoose';

export interface PropsBoxInputAuth {
  id: string;
  autoComplete: string;
  type: string;
  label: string;
  validationText?: string;
  register: UseFormRegisterReturn; // FieldValues
  linkLabel?: string; // описание страницы для перехода
  link?: string; // путь на страницу
  disabled?: boolean;
}
export type PropsBoxInput = {
  id: string;
  name?: string;
  autoComplete: string;
  type: string;
  label?: string;
  disabled?: boolean;
  validationText?: string;
  showValidationText?: boolean;
  hideCheckmark?: boolean;
  defaultValue?: string;
  register?: UseFormRegisterReturn; // FieldValues
  min?: string;
  max?: string;
  loading?: boolean;
  refTextArea?: LegacyRef<HTMLTextAreaElement>;
  tooltip?: { text: string; id: string };
  maxLength?: number;
};

/**
 * Пропсы для Select использующего библиотеку react-hook-form.
 */
export type PropsBoxSelect = Omit<PropsBoxInput, 'type' | 'autoComplete'> & {
  options: { id: number; translation: string; name: string }[];
};

/**
 * Пропсы для Input загрузки файла трэка GPX.
 */
export type PropsBoxInputFile = {
  title?: string;
  isLoading?: boolean;
  setTrack: Dispatch<SetStateAction<File | null>>;
  resetData: boolean; // Триггер сброса изображения.
  value: string; // Режим редактирования Маршрута?
  validationText?: string; // Текст если есть ошибка валидации, иначе ''
  isRequired?: boolean; // Обязателен ли файл к загрузке.
  needDelTrack?: boolean;
  setNeedDelTrack?: Dispatch<SetStateAction<boolean>>;
  tooltip?: { text: string; id: string };
};

export type PropsBoxSelectSimple = {
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  id?: string;
  name: string;
  label?: string;
  disabled?: boolean;
  validationText?: string;
  showValidationText?: boolean;
  defaultValue?: string;
  loading?: boolean;
  options: { id: number; translation: string; name: string }[];
};
export type PropsSelect<T> = {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
  id?: string;
  name: string;
  label?: string;
  disabled?: boolean;
  validationText?: string;
  showValidationText?: boolean;
  defaultValue?: string;
  loading?: boolean;
  options: { id: number; translation: string; name: string }[];
};
export type TOptions = {
  id: number;
  translation: string;
  name: string;
  icon?: React.ComponentType<TIconProps>;
};

/**
 * Типизация options когда структура данных Map.
 */
export type TOptionsMap = Map<
  string,
  {
    translation: string;
    icon?: React.ComponentType<TIconProps>;
  }
>;

/**
 * Пропсы для BoxInputSimple
 */
export type PropsBoxInputSimple<T> = Omit<PropsBoxInput, 'register' | 'setValue'> &
  TDispatchInput & { handlerInput: (value: T) => void }; // eslint-disable-line no-unused-vars
/**
 * Описание для инпута useState
 */
type TDispatchInput = { value: any; setValue?: Dispatch<SetStateAction<any>> };
/**
 * Данные пользователя, возвращаемые после регистрации
 */
export interface IUserData {
  id: string;
  username: string;
  email: string;
  role: string;
}

/**
 * Данные запрашиваемые при регистрации нового пользователя
 */
export interface IRegistrationForm {
  username: string;
  email: string;
  password: string;
}
/**
 * Данные профиля для изменения в account/profile
 */
export type TFormProfile = {
  id: string;
  image?: File | undefined;
  firstName: string;
  patronymic?: string;
  lastName: string;
  birthday?: string | Date;
  gender: string;
  city?: string;
  phone?: string;
  bio?: string;
  imageFromProvider?: boolean | string;
  [key: string]: any;
};
/**
 * Данные профиля для изменения в account/profile
 */
export type TFormCalendar = {
  title: string;
  date: string;
  urlSlug: string;
  bikeType: string;
};
/**
 * Данные формы создания Организатора.
 */
export type TFormOrganizerCreate = Omit<
  TOrganizer,
  '_id' | 'creator' | 'championshipCreationFee'
> & {
  logoUrl?: string; // url Лого клуба. (Существует при редактировании Организатора)
  posterUrl?: string; // url Постер для страницы клуба. (Существует при редактировании Организатора)
  logoFile: File | null; // Файл загружаемого Лого клуба.
  posterFile: File | null; // Файл загружаемого Постера для страницы клуба.
};

/**
 * Данные профиля (аккаунта) для изменения в account/details
 */
export type TFormAccount = {
  telegram?: string;
  vk?: string;
  youtube?: string;
  komoot?: string;
  strava?: string;
  whatsapp?: string;
  garminConnect?: string;
  phone?: string;
  role: string;
  email: string;
  id: number;
};

/**
 * Данные profile из provider Yandex
 */
export type ProfileProvider = {
  id: string;
  login: string;
  client_id: string;
  display_name: string;
  real_name: string;
  first_name: string; // yandex, vk
  last_name: string; // yandex, vk
  sex: string;
  default_email: string;
  emails?: [string];
  default_avatar_id?: string;
  is_avatar_empty?: boolean;
  psuid?: string;
  given_name?: string; // google
  family_name?: string; // google
  email: string; // google
  name?: string; // google
  picture: string; // google
  photo_100: string; // vk
};

/**
 * Ответ с сервера.
 */
export type ResponseServer<T> = {
  data: T | null;
  ok: boolean;
  message: string;
  statusCode?: number;
};

/**
 * Меню которое располагается на страницах с кнопками и линками.
 */
export type TMenuOnPage = {
  id: number;
  name: string;
  classes: string[];
  href?: string;
  onClick?: () => void;
  isMyButton?: boolean; // отображается только авторизованному пользователю для данной кнопки
  permission: string | null; // правило доступа
  icon?: React.ComponentType<TIconProps>;
};

/**
 * Меню Попап с навигацией для главного навбара.
 */
export type TMenuPopup = {
  id: number;
  name: string;
  href: string;
  permission: string | null; // правило доступа
  icon?: React.ComponentType<TIconProps>;
};

/**
 * Навигационные линки.
 */
export type TNavLink = {
  id: number;
  name: string;
  href?: string;
  permission: string | null; // правило доступа
  icon?: React.ComponentType<TIconProps>;
};

/**
 * Данные блоков для ввода информации, при создании новости, маршрутов и т.д..
 */
export type TBlockInputInfo = Omit<TNewsBlockInfo, '_id'> & {
  imageFile: File | null; // Изображение в формате File/
  imageOldUrl?: string | null; // Старый Url изображения в блоке, возвращаем для удаления изображения из облака.
  imageDeleted?: boolean; // true - изображение было удалено, новое не установленно.
};

/**
 * Пропсы для иконок.
 */
export type TIconProps = {
  squareSize?: number;
  isActive?: boolean; // нажатое состояние
  getClick?: () => void;
  // Наборы цветов под разные случаи.
  colors?: IconColors;
  tooltip?: { text: string; id: string };
};
type IconColors = {
  default?: string;
  active?: string;
  hover?: string;
};
export type CSSVariables = {
  '--color-icon-default'?: string;
  '--color-icon-active'?: string;
  '--color-icon-hover'?: string;
};

/**
 * Инстанс Error после парсинга полей<div className=""></div>
 */
export type TLogsErrorParsed = Omit<TLogsErrorModel, 'createdAt' | 'updatedAt' | '_id'>;

// /**
//  * Подключение к облаку.
//  */
// export type TCloudConnect = {
//   cloudName: 'vk';
//   bucketName: string;
//   domainCloudName: string;
// };

/**
 * Сохранение файла в облаке.
 */
export type TSaveFile = {
  file: File;
  type: 'image' | 'GPX' | 'pdf';
  suffix: string;
};

/**
 * Данные с клиента при создании/редактировании Маршрута.
 */
export type TTrailCreateFromClient = {
  title: string; // Заголовок новости.
  region: string;
  difficultyLevel: string;
  startLocation: string;
  turnLocation: string;
  finishLocation: string;
  distance: number;
  ascent: number;
  garminConnect: string;
  komoot: string;
  hashtags: string;
  bikeType: string;
  poster: File | null; // Изображение заголовка маршрута.
  urlSlug?: string; // urlSlug редактируемого маршрута, если его нет, значит маршрут создаётся.
  posterOldUrl?: string | null; // posterOldUrl старого постера, необходим для удаления файла из облака, если был изменен при редактировании новости.
  blocks: TBlockInputInfo[]; // Блоки, содержащие текст и изображения.
  track: File | null; // Трэк маршрута в GPX.
  trackGPX?: string | undefined;
  isEditing: boolean;
};

/**
 * Данные с клиента при создании/редактировании Новости.
 */
export type TNewsCreateFromClient = {
  blocks: TBlockInputInfo[]; // Блоки новостей, содержащие текст и изображения.
  title: string; // Заголовок новости.
  subTitle: string; // Подзаголовок новости.
  hashtags: string; // Хэштег новости.
  poster: File | null; // Изображение заголовка новости.
  urlSlug?: string; // urlSlug редактируемой новости, если его нет, значит новость создаётся.
  important: boolean; // important Важная новость?
  posterOldUrl?: string | null; // posterOldUrl старого постера, необходим для удаления файла из облака, если был изменен при редактировании новости.
  filePdf?: File | null; // Протокол или другой файл в формате pdf.
};

/**
 * Возвращение документов для текущей страницы пагинации
 */
export interface DocsAfterPagination<T> {
  currentDocs: Array<T>;
  currentPage: number;
  quantityPages: number;
}

/**
 * Данные трэка после парсинга GPX файла.
 */
export type GPX = {
  gpx: {
    $: {
      creator: string;
      version: string;
      'xsi:schemaLocation': string;
      'xmlns:ns3': string;
      xmlns: string;
      'xmlns:xsi': string;
      'xmlns:ns2': string;
    };
    metadata: GpxMetadata[];
    trk: GpxTrk[];
  };
};
type GpxLink = {
  $: {
    href: string;
  };
  text: string[];
};
type GpxMetadata = {
  name: string[];
  link: GpxLink[];
  time: string[];
};
export type GpxTrackPoint = {
  $: {
    lat: string;
    lon: string;
  };
  ele: string[];
  time: string[];
};
type GpxTrackSegment = {
  trkpt: GpxTrackPoint[];
};
type GpxTrk = {
  name: string[];
  trkseg: GpxTrackSegment[];
};
export type ElevationData = {
  distance: number;
  elevation: number;
};
/**
 * Пропсы интерактивных блоков news,trails.
 */
export type InteractiveBlockProps = {
  likesCount?: number; // Количество лайков.
  commentsCount?: number; // Количество комментариев.
  viewsCount?: number; // Количество просмотров.
  idDocument: string; // id новости или маршрута.
  isLikedByUser: boolean;
  target: 'news' | 'trail';
};
/**
 * Метаданные GPS трэка после парсинга.
 */
export type MetadataParsed = {
  name: string; // Название трэка.
  time: Date | null; // Дата создания трэка.
  link: {
    href: string; // Сервис, на котором создан трэк.
    text: string; // Название сервиса, на котором создан трэк.
  } | null;
};
/**
 * Позиция точки в после парсинга GPX.
 */
export interface LatLng {
  lat: number;
  lng: number;
  ele: number; // Добавляем ele для высоты
}
/**
 * Данные GPS трэка после парсинга.
 */
export type TrackData = {
  positions: LatLng[];
  metadata: MetadataParsed;
};

// /**
//  * Данные Чемпионата с БД.
//  */
// export type TChampionshipWithUser = Omit<TChampionship, 'organizer'> & {
//   organizer: TAuthorFromUser;
// };

/**
 * Данные Чемпионата с БД.
 */
export type TOrganizerPublic = Pick<
  TOrganizer,
  '_id' | 'name' | 'urlSlug' | 'logoUrl' | 'contactInfo'
>;
export type TOrganizerForClient = Pick<
  TOrganizer,
  'name' | 'urlSlug' | 'logoUrl' | 'contactInfo'
> & {
  _id: string;
};
export type TChampionshipWithOrganizer = Omit<TChampionship, 'organizer'> & {
  organizer: TOrganizerPublic;
  stageDateDescription: TStageDateDescription[];
  parentChampionship: TParentChampionship;
};
export type TParentChampionship = Pick<TChampionship, '_id' | 'name' | 'stage' | 'type'>;
export type TParentChampionshipForClient = Omit<TParentChampionship, '_id'> & { _id: string };

/**
 * Данные для формы создания Чемпионата.
 */
export type TFormChampionshipCreate = Omit<
  TChampionship,
  | '_id'
  | 'organizer'
  | 'startDate'
  | 'endDate'
  | 'status'
  | 'trackGPX'
  | 'parentChampionship'
  | 'races'
> & {
  posterUrl?: string; // url Постер для страницы Чемпионата. (Существует при редактировании Организатора)
  posterFile: File | null; // Файл загружаемого Постера для страницы клуба.
  startDate: string;
  endDate: string;
  races: TRaceForForm[];
  parentChampionship: { _id: string; name: string };
};
export type TRaceForForm = Omit<TRace, 'trackGPX' | 'registeredRiders'> & {
  trackGPXFile: File | null;
  trackGPXUrl: string | null;
  trackGPX?: TTrackGPXObj;
  registeredRiders: string[];
};

/**
 * Данные Этапа для формирования карточки Чемпионата.
 */
export type TStageDateDescription = {
  stage: number;
  status: TChampionshipStatus;
  startDate: Date;
  endDate: Date;
};

/**
 * Данные Зарегистрированного Райдера из БД.
 */
export type TRegisteredRiderFromDB = {
  _id: mongoose.Types.ObjectId;
  championship: mongoose.Types.ObjectId;
  raceNumber: number;
  raceName?: string;
  rider: TRider;
  teamVariable?: string;
  startNumber: number;
  status: TRaceRegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
};
export type TRider = {
  _id: mongoose.Types.ObjectId;
  id: number;
  person: {
    firstName: string;
    lastName: string;
    patronymic?: string;
    gender: 'male' | 'female';
    birthday: Date;
  };
  provider: {
    image?: string;
  };
  image?: string;
  imageFromProvider: boolean;
  team?: mongoose.Types.ObjectId;
  city?: string;
};

/**
 * Данные райдера, в частности для Регистрации на Чемпионат.
 */
export type TProfileForRegistration = {
  firstName: string | null;
  lastName: string | null;
  ageCategory: string | null;
  city: string | null;
  gender: 'male' | 'female';
};
// Получаем ключи из TProfileForRegistration
export type TProfileKey = keyof TProfileForRegistration;

/**
 * Данные для регистрации в Заезде Соревнования/Этапа из формы с клиента.
 */
export type TRegistrationRaceDataFromForm = {
  championshipId: string;
  raceNumber: number;
  startNumber: number;
  teamVariable: string;
};

export type TRaceClient = Omit<TRace, 'registeredRiders'> & { registeredRiders: string[] };

/**
 * Данные по Регистрации Райдера в Чемпионате.
 */
export type TRegistrationRiderFromDB = {
  _id: mongoose.Types.ObjectId;
  championship: {
    _id: mongoose.Types.ObjectId;
    name: string;
    urlSlug: string;
    parentChampionship: { name: string; urlSlug: string; type: TChampionshipTypes };
    startDate: Date;
    endDate: Date;
    status: 'upcoming';
    type: TChampionshipTypes;
    races: TRace[];
    posterUrl: string;
  };
  rider: mongoose.Types.ObjectId;
  raceNumber: number;
  startNumber: number;
  status: TRaceRegistrationStatus;
  createdAt: Date;
};

/**
 * Данные формы для установки результата райдера в Заезде Чемпионата.
 */
export type TFormResultRace = {
  // Данные райдера из списка зарегистрированных в Заезде.
  riderRegisteredInRace: {
    lastName: string;
    startNumber: number;
  };
  riderRegisteredSite: {
    lastName: string;
    id: number;
  };
  rider: {
    _id?: string; // id из БД.
    id?: number; // id пользователя на сайте.
    firstName: string;
    patronymic?: string;
    lastName: string;
    yearBirthday: number | string; // Год рождения.
    fullYears: number;
    fractionalYears: number;
    gender: 'male' | 'female';
    city?: string;
    team?: string;
  };
  newStartNumber: number | string;
  time: TTimeDetails;
};

// Данные из инпута приходят всегда как строка.
export type TTimeDetails = {
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: string;
};

export type TResultRaceRiderDeserialized = Omit<TFormResultRace, 'time'> & {
  timeInMilliseconds: number;
};
