import type {
  Control,
  FieldArrayWithId,
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  Merge,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormReset,
} from 'react-hook-form';
import {
  IUserModel,
  TCategories,
  TChampionship,
  TChampionshipDocument,
  TChampionshipStatus,
  TChampionshipTypes,
  TLogsErrorModel,
  TNewsBlockInfo,
  TOrganizer,
  TPerson,
  TRace,
  TRaceRegistration,
  TRaceRegistrationStatus,
  TResultRace,
  TTrackGPXObj,
} from './models.interface';
import { Dispatch, LegacyRef, MutableRefObject, SetStateAction } from 'react';
import mongoose, { Types } from 'mongoose';
import {
  TDtoChampionship,
  TDtoOrganizer,
  TResultRaceDto,
  TRoleDto,
  TToursAndSeriesDto,
} from './dto.types';

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
  loading?: boolean;
  refTextArea?: LegacyRef<HTMLTextAreaElement>;
  tooltip?: { text: string; id: string };
  hasError?: boolean; // Наличие ошибки валидации.
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
  disabledEmpty?: boolean; // Блокировка пустой option.
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
export type TFormAccount = Pick<
  IUserModel,
  'social' | 'preferences' | 'phone' | 'id' | 'email'
> & { role: TRoleDto };

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
export type ServerResponse<T> = {
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
  name: string | null; // Название трэка.
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
export type TChampionshipWithOrganizer = Omit<
  TChampionship,
  'organizer' | 'categoriesConfigs' | 'races'
> & {
  organizer: TOrganizerPublic;
  stageDateDescription: TStageDateDescription[];
  parentChampionship: TParentChampionship;
  categoriesConfigs: TCategories[];
  races: TRace[];
};
export type TParentChampionship = Pick<TChampionship, '_id' | 'name' | 'stage' | 'type'>;
export type TParentChampionshipForClient = Omit<TParentChampionship, '_id'> & { _id: string };

/**
 * Данные для формы создания Чемпионата.
 */
export type TFormChampionshipCreate = Omit<
  TChampionship,
  '_id' | 'organizer' | 'startDate' | 'endDate' | 'status' | 'parentChampionship' | 'races'
> & {
  posterUrl?: string; // url Постер для страницы Чемпионата. (Существует при редактировании Организатора)
  posterFile: File | null; // Файл загружаемого Постера для страницы клуба.
  startDate: string;
  endDate: string;
  parentChampionship: { _id: string; name: string };
};
// export type TFormChampionshipCreate = Omit<
//   TChampionship,
//   | '_id'
//   | 'organizer'
//   | 'startDate'
//   | 'endDate'
//   | 'status'
//   | 'parentChampionship'
//   | 'races'
// > & {
//   posterUrl?: string; // url Постер для страницы Чемпионата. (Существует при редактировании Организатора)
//   posterFile: File | null; // Файл загружаемого Постера для страницы клуба.
//   startDate: string;
//   endDate: string;
//   races: TRaceForForm[] | null;
//   parentChampionship: { _id: string; name: string };
// };

export type TCategoryAgeFromForm = {
  min: string; // Значение минимального возраста из формы (всегда приходит как строка).
  max: string; // Значение максимального возраста из формы (всегда приходит как строка).
  name: string; // Название категории (например, "М10-20").
};

export type TRaceForFormDeserialized = Omit<
  TRace,
  'trackGPX' | 'registeredRiders' | 'categories'
> & {
  trackGPXFile: File | null;
  trackGPXUrl: string | null;
  trackGPX?: TTrackGPXObj;
  categoriesId: string; // _id пакета категорий в БД.
  registeredRiders?: string[];
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
  race: mongoose.Types.ObjectId;
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
  raceId: string;
  startNumber: number;
  teamVariable: string;
};

export type TRaceForForm = Omit<
  TRace,
  '_id' | 'championship' | 'trackGPX' | 'registeredRiders' | 'categories'
> & {
  _id: string;
  championship: string;
  trackGPXFile?: File | null;
  trackGPXUrl?: string | null;
  trackGPX: TTrackGPXObj;
  categories: string; // _id конфига категорий.
  registeredRiders: string[];
};
// FIXME: Разобраться с названиями TRaceForForm, TRaceForFormNew одна для запроса с клиента, другая для формы.
export type TRaceForFormNew = Omit<
  TRaceForForm,
  '_id' | 'championship' | 'trackGPX' | 'registeredRiders' | 'categories'
> & {
  _id?: string;
  categories?: string;
  trackGPX?: TTrackGPXObj;
};

/**
 * Данные по Регистрации Райдера в Чемпионате.
 */
export type TRegistrationRiderFromDB = Pick<
  TRaceRegistration,
  '_id' | 'rider' | 'startNumber' | 'status' | 'createdAt'
> & {
  championship: {
    _id: mongoose.Types.ObjectId;
    name: string;
    urlSlug: string;
    parentChampionship: { name: string; urlSlug: string; type: TChampionshipTypes };
    startDate: Date;
    endDate: Date;
    status: 'upcoming';
    type: TChampionshipTypes;
    posterUrl: string;
  };
  race: TRace;
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
  _id?: string;
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
  categorySkillLevel?: string | null;
  time: TTimeDetails;
};

/**
 * Данные формы отправляемые на сериализацию.
 */
export type TDataFromFormResultRace = {
  city?: string;
  firstName: string;
  gender: 'male' | 'female';
  id?: number; // id пользователя на сайте (1000 и т.д.).
  _id?: string;
  lastName: string;
  patronymic?: string;
  startNumber: string | number;
  team?: string;
  timeDetailsInMilliseconds: number;
  yearBirthday: string | number;
  raceNumber: string;
  championshipId: string;
  categorySkillLevel: string | null;
};

// Данные из инпута приходят всегда как строка.
export type TTimeDetails = {
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: string;
};

export type TResultRaceRiderDeserialized = Omit<
  TDataFromFormResultRace,
  'startNumber' | 'yearBirthday' | 'raceNumber'
> & {
  startNumber: number;
  yearBirthday: number;
  raceId: string;
  resultId?: string;
};

/**
 * Данные профиля минимальным количеством данных из БД.
 */
export type TProfileSimpleFromDB = {
  id: number;
  person: {
    firstName: string;
    lastName: string;
    patronymic?: string;
    birthday: Date;
    gender: 'male' | 'female';
  };
  city?: string;
};

/**
 * Данные результата райдера в заезде чемпионата.
 */
export type TResultRaceFromDB = TResultRace & {
  rider: {
    id: number;
    image?: string;
    provider?: { image?: string };
    imageFromProvider: boolean;
  };
};

/**
 * Данные результата райдера в заезде чемпионата для Профиля пользователя.
 */
export type TRiderRaceResultDB = Omit<
  TResultRace,
  'championship' | 'createdAt' | 'updatedAt' | 'creator' | 'rider'
> & {
  championship: Pick<TChampionship, 'name' | 'urlSlug' | 'endDate'>;
  race: TRace;
};

/**
 * Данные для формы модерации Роли.
 */
export interface TFormRole {
  _id?: string;
  name: string;
  description: string;
  permissions: string[];
}

/**
 * Данные для формы модерации Пользователя.
 */
export interface TFormModerateUser {
  _id: string;
  id: string;
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  city?: string;
  gender: 'male' | 'female';
  roleId: string;
}

/**
 * Обновленные данные Пользователя администратором.
 */
export interface TUserModeratedData {
  id: number;
  roleId: string;
  person: {
    firstName?: string;
    lastName?: string;
    patronymic?: string;
    gender: 'male' | 'female';
  };
  city?: string;
}

/**
 * Получение данных об чемпионате для таблицы зарегистрированных участников.
 */
export type TChampionshipForRegistered = Pick<
  TChampionship,
  '_id' | 'name' | 'type' | 'startDate' | 'endDate'
> & {
  races: TRace[];
};

/**
 * Получение данных об чемпионате для таблицы зарегистрированных участников.
 */
export type TChampionshipForRegisteredClient = Omit<
  TChampionshipForRegistered,
  'races' | '_id'
>;

/**
 * Протокол заезда с результатами райдеров.
 */
export type TProtocolRace = {
  protocol: TResultRaceDto[];
  categories: string[];
  race: { name: string; _id: string };
};

/**
 * Пропсы для params, searchParams.
 */
export type TParamsProps = {
  params: Promise<{
    urlSlug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Пропсы для компонента FormChampionshipMain.
 * @property organizer - Объект организатора, от имени которого создается или редактируется чемпионат.
 * @property fetchChampionshipCreated - Функция для отправки формы создания чемпионата (POST-запрос).
 * @property putChampionship - Функция для отправки формы редактирования чемпионата (PUT-запрос).
 * @property championshipForEdit - Объект существующего чемпионата, если происходит редактирование.
 * @property parentChampionships - Список доступных родительских чемпионатов для выбора и связи.
 * @property setIsFormDirty - Флаг фиксирующий изменения в форме.
 */
export type TFormChampionshipProps = {
  organizer: TDtoOrganizer;
  fetchChampionshipCreated?: (formData: FormData) => Promise<ServerResponse<any>>;
  putChampionship?: ({
    dataSerialized,
    urlSlug,
  }: {
    dataSerialized: FormData;
    urlSlug: string;
  }) => Promise<ServerResponse<any>>;
  championshipForEdit?: TDtoChampionship;
  parentChampionships: TToursAndSeriesDto[];
  setIsFormDirty: Dispatch<SetStateAction<boolean>>;
};

/**
 * Пропсы для компонента FormChampionshipCategories.
 * @property putCategories - Функция для отправки формы редактирования категорий чемпионата.
 * @property championshipForEdit - Объект существующего чемпионата, если происходит редактирование.
 * @property setIsFormDirty - Флаг фиксирующий изменения в форме.
 */
export type TFormChampionshipCategoriesProps = {
  organizerId: string;
  putCategories: (params: TPutCategoriesParams) => Promise<ServerResponse<any>>;
  categoriesConfigs: TClientCategoriesConfigs[];
  setIsFormDirty: Dispatch<SetStateAction<boolean>>;
  urlSlug: string;
};

/**
 * Пропсы для компонента FormChampionshipRaces.
 */
export type TFormChampionshipRacesProps = {
  putRaces: (params: TPutRacesParams) => Promise<ServerResponse<any>>;
  races: TRaceForForm[];
  organizerId: string;
  categoriesConfigs: TClientCategoriesConfigs[];
  setIsFormDirty: Dispatch<SetStateAction<boolean>>;
  urlSlug: string;
};

/**
 * Типы из формы (min,max могут быть как number так и string).
 */
export type TAgeCategoryFromForm = { min: number | string; max: number | string; name: string };

/**
 * Конфигурации категорий чемпионата для формы.
 */
export type TCategoriesConfigsForm = Omit<TCategories, '_id' | 'championship' | 'age'> & {
  _id?: string;
  age: {
    female: TAgeCategoryFromForm[];
    male: TAgeCategoryFromForm[];
  };
};

/**
 * Конфигурации категорий чемпионата на клиенте.
 */
export type TClientCategoriesConfigs = Omit<TCategories, '_id' | 'championship'> & {
  _id: string; // Существует, так как это уже созданная конфигурация категорий.
};

export type TCContainerChampionshipFormsProps = {
  organizer: TDtoOrganizer;
  fetchChampionshipCreated?: (formData: FormData) => Promise<ServerResponse<any>>;
  putChampionship?: ({
    dataSerialized,
    urlSlug,
  }: {
    dataSerialized: FormData;
    urlSlug: string;
  }) => Promise<ServerResponse<any>>;
  championshipForEdit?: TDtoChampionship;
  parentChampionships: TToursAndSeriesDto[];
  putCategories?: (params: TPutCategoriesParams) => Promise<ServerResponse<any>>;
  putRaces?: (params: TPutRacesParams) => Promise<ServerResponse<any>>;
};

/**
 * Параметры для хука useSubmitChampionship.
 *
 * @property championshipForEdit - Данные чемпионата для редактирования (если режим редактирования).
 * @property organizerId - ID организатора (владелец чемпионата).
 * @property urlTracksForDel - Список ссылок на треки, которые нужно удалить (используется при редактировании).
 * @property fetchChampionshipCreated - Функция для создания нового чемпионата (POST).
 * @property putChampionship - Функция для обновления существующего чемпионата (PUT).
 * @property reset - Функция сброса формы от react-hook-form.
 */
export type TUseSubmitChampionshipParams = {
  championshipForEdit?: TDtoChampionship;
  organizerId: any;
  urlTracksForDel: MutableRefObject<string[]>;
  fetchChampionshipCreated?: (formData: FormData) => Promise<ServerResponse<any>>;
  putChampionship?: (args: {
    dataSerialized: FormData;
    urlSlug: string;
  }) => Promise<ServerResponse<any>>;
  reset: UseFormReset<TFormChampionshipCreate>;
  setIsFormDirty: Dispatch<SetStateAction<boolean>>;
};

/**
 * Параметры для хука useSubmitChampionshipCategories.
 */
export type TUseSubmitChampionshipCategoriesParams = {
  putCategories: (params: TPutCategoriesParams) => Promise<ServerResponse<any>>;
  organizerId: string;
  setIsFormDirty: Dispatch<SetStateAction<boolean>>;
  urlSlug: string;
};

/**
 * Параметры для хука useSubmitChampionshipRaces.
 */
export type TUseSubmitChampionshipRacesParams = {
  putRaces: (params: TPutRacesParams) => Promise<ServerResponse<any>>;
  organizerId: string;
  setIsFormDirty: Dispatch<SetStateAction<boolean>>;
  urlSlug: string;
  urlTracksForDel: string[];
};

/**
 * Пропсы для компонента BlockRaceAdd.
 */
export type TBlockRaceAddProps = {
  race: TRaceForFormNew;
  races: FieldArrayWithId<{ races: TRaceForFormNew[] }>[];
  index: number;
  register: UseFormRegister<{ races: TRaceForFormNew[] }>;
  append: UseFieldArrayAppend<{ races: TRaceForFormNew[] }>;
  remove: UseFieldArrayRemove;
  errors: FieldErrors<{ races: TRaceForFormNew[] }>;
  control: Control<{ races: TRaceForFormNew[] }, any>;
  isLoading: boolean;
  urlTracksForDel: MutableRefObject<string[]>;
  hideCategoryBlock?: boolean;
  categories: TOptions[];
};

/**
 * Описание одной возрастной категории (используется в пределах набора).
 */
export type TCategoryAge = {
  min: number; // Минимальный возраст (включительно).
  max: number; // Максимальный возраст (включительно).
  name: string; // Название, например "Юниоры 18-23".
};

/**
 * Описание одной категории по уровню подготовки (буквенной категории).
 * Данные категории проставляется при регистрации (или в финишном протоколе).
 */
export type TCategorySkillLevel = {
  name: string; // Название категории, например: "A", "B", "Pro".
  description?: string; // Описание категории, например: "Для опытных гонщиков".
};

/**
 * Входные параметры приватного метода получения категорий для заезда raceNumber чемпионата championshipId.
 */
export type TGetRaceCategoriesParams = {
  championshipId: string;
  categoriesId: Types.ObjectId;
  raceId: string;
};

/**
 * Входные параметры метода обновления всех категорий для чемпионата, которые пришли с клиента.
 */
export type TPutCategoriesParams = {
  dataSerialized: FormData;
  organizerId: string;
  urlSlug: string;
};
export type TPutRacesParams = TPutCategoriesParams;

/**
 * Пропсы компонента CategoriesSet/
 */
export type TCategoriesSetProps = {
  categories: FieldArrayWithId<
    {
      categories: TCategoriesConfigsForm[];
    },
    'categories',
    'id'
  >;
  register: UseFormRegister<{ categories: TCategoriesConfigsForm[] }>;
  isDefault?: boolean; // Пакет категорий по умолчанию, или дополнительный.
  appendCategories: UseFieldArrayAppend<
    {
      categories: TCategoriesConfigsForm[];
    },
    'categories'
  >;
  removeCategories: UseFieldArrayRemove;
  control: Control<{ categories: TCategoriesConfigsForm[] }>;
  errors: FieldErrors<{ categories: TCategoriesConfigsForm[] }>;
  categoriesIndex: number;
};

export type TCategoriesFormType = { categories: TCategoriesConfigsForm[] };
/**
 * Пропсы для компонента AgeCategoryInputFields.
 */
export type TAgeCategoryInputFieldsProps = {
  register: UseFormRegister<TCategoriesFormType>;

  // Пол: male или female — нужен для метки
  categoryProperty: 'male' | 'female';

  // Префикс пути до конкретной категории, например: "categories.0.age.male.0"
  fieldPathPrefix:
    | `categories.${number}.age.male.${number}`
    | `categories.${number}.age.female.${number}`
    | `categories.${number}.skillLevel.male.${number}`
    | `categories.${number}.skillLevel.female.${number}`;

  // Ошибки валидации для полей min/max/name
  fieldErrors:
    | Merge<
        FieldError,
        FieldErrorsImpl<{
          min: number;
          max: number;
          name: string;
        }>
      >
    | undefined;
};

/**
 * Пропсы для компонента SkillLevelCategoryInputFields.
 */
export type TSkillLevelCategoryInputFieldsProps = Omit<
  TAgeCategoryInputFieldsProps,
  'categoryProperty' | 'fieldErrors'
> & {
  fieldErrors:
    | Merge<
        FieldError,
        FieldErrorsImpl<{
          name: string;
          description: number;
        }>
      >
    | undefined;
};

/**
 * Пропсы для компонента BlockCategories.
 */
export type TBlockCategoriesProps = {
  categories: FieldArrayWithId<
    {
      categories: TCategoriesConfigsForm[];
    },
    'categories',
    'id'
  >;
  register: UseFormRegister<{ categories: TCategoriesConfigsForm[] }>;
  errors: FieldErrors<{ categories: TCategoriesConfigsForm[] }>;
  control: Control<{ categories: TCategoriesConfigsForm[] }>;
  categoriesIndex: number;
};

/**
 * Пропсы для компонента BlockCategory.
 */
export type TBlockCategoryProps = {
  register: UseFormRegister<{ categories: TCategoriesConfigsForm[] }>;
  errors: FieldErrors<{ categories: TCategoriesConfigsForm[] }>;
  control: Control<{ categories: TCategoriesConfigsForm[] }>;
  categoriesIndex: number;
  fieldKey: 'age' | 'skillLevel';
};

/**
 * Функция для десериализации данных при изменении категорий Чемпионата
 */
export type TDeserializedCategories = Omit<TCategories, '_id'> & { _id?: string };

/**
 * Возвращаемые десериализованные данные заездов чемпионата из deserializeRaces.
 */
export type TDeserializedRacesData = { races: TRaceForFormNew[] } & {
  urlTracksForDel: string[];
} & {
  [key: string]: any;
};

/**
 * Параметры метода post класса RegistrationChampService.
 */
export type RegChampPostParams = TRegistrationRaceDataFromForm & { riderId: string };

/**
 * Параметры метода processReg класса RegistrationChampService.
 */
export type ProcessRegParams = {
  raceIdWithCanceledReg: mongoose.Types.ObjectId | undefined;
  championshipId: string;
  riderId: string;
  raceId: string;
  startNumber: number;
  teamVariable?: string;
};

/**
 * Форма FormRaceRegistration.
 */
export type TFormRaceRegistration = {
  raceId: string;
  startNumber: number;
  teamVariable: string;
};

/**
 * Пропсы компонента FormRaceRegistration.
 */
export type TFormRaceRegistrationProps = {
  races: TRaceForForm[];
  championshipId: string;
  profile: TProfileForRegistration;
};

export type TDocumentSectionContent = {
  number?: string | number;
  text: string;
  term?: {
    term: string;
    definition: string;
  }[];
  list?: string[];
  contentSecond?: {
    number?: string | number;
    text: string;
  }[];
};

export type TDocumentSection = {
  number?: string | number;
  title?: string;
  content: TDocumentSectionContent[];
};

export type TJsonDocument = {
  application?: string;
  applicationAffiliation?: string;
  title: string;
  lastUpdated?: string;
  sections: TDocumentSection[];
};

/**
 * Пропсы компонента-страницы. Получение params url.
 */
export type TPageProps = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * ФИО Пользователя.
 */
export type TUserFullName = Pick<TPerson, 'lastName' | 'firstName' | 'patronymic'>;

/**
 * Параметры для формирования отображаемого имени пользователя.
 */
export type TGetUserFullNameParams = {
  person: TUserFullName;
  showPatronymic?: boolean;
};

export type TChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

/**
 * Параметры для приватного метода addCategoryConfigsIds в классе ChampionshipService.
 */
export type TAddCategoryConfigsIdsParams = {
  type: TChampionshipTypes;
  parentChampionshipId: string | undefined;
  championshipCreated: TChampionshipDocument;
};
/**
 * Параметры для приватного метода addCategoryConfigsIds в классе ChampionshipService.
 */
export type TGetChampUrlSlugParams = {
  champName: string;
  parentChampionshipId: string | undefined;
  type: TChampionshipTypes;
};
/**
 * Возвращаемые значения приватного метода getParentChampionship в классе ChampionshipService.
 */
export type TGetParentChampionship = { categoriesConfigs: Types.ObjectId[]; urlSlug: string };
