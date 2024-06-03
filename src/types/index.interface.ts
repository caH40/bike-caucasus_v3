import type { UseFormRegisterReturn } from 'react-hook-form';
import { TLogsErrorModel, TNewsBlockInfo } from './models.interface';
import { Dispatch, LegacyRef, SetStateAction } from 'react';

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
  defaultValue?: string;
  register?: UseFormRegisterReturn; // FieldValues
  min?: string;
  max?: string;
  loading?: boolean;
  refTextArea?: LegacyRef<HTMLTextAreaElement>;
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
 * Входные параметры функции передаваемые динамически route next
 */
export type ParamsWithId = {
  params: {
    id: string; // id профиля пользователя на сайте
  };
};

/**
 * Ответ с сервера.
 */
export type ResponseServer<T> = {
  data: T | null;
  ok: boolean;
  message: string;
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
};

/**
 * Инстанс Error после парсинга полей<div className=""></div>
 */
export type TLogsErrorParsed = Omit<TLogsErrorModel, 'createdAt' | 'updatedAt' | '_id'>;

/**
 * Подключение к облаку.
 */
export type TCloudConnect = {
  cloudName: 'vk';
  bucketName: string;
  domainCloudName: string;
};

/**
 * Сохранение файла в облаке.
 */
export type TSaveImage = {
  fileImage: File;
  suffix: string;
  cloudName: 'vk';
  domainCloudName: string;
  bucketName: string;
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
  posterOldUrl?: string | null; // posterOldUrl старого постера, необходим для удаления файла из облака, если был изменен при редактировании новости.
};
