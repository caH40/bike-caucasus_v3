import type { UseFormRegisterReturn } from 'react-hook-form';
import { TNews, TNewsBlock } from './models.interface';
import { Dispatch, SetStateAction } from 'react';

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
};
/**
 * Пропсы для BoxInputSimple
 */
export type PropsBoxInputSimple = Omit<PropsBoxInput, 'register' | 'setValue'> &
  // eslint-disable-next-line no-unused-vars
  TDispatchInput & { handlerInput: (value: string) => void };
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
 * Меню которое располагается на страницах с кнопками и линками
 */
export type TMenuOnPage = {
  id: number;
  name: string;
  classes: string[];
  href?: string;
  onClick?: () => void;
  isMyButton?: boolean; // отображается только авторизованному пользователю для данной кнопки
};

/**
 * типы с добавлением image типа File для отправки на сервер
 */
export type TNewsBlocksEdit = Omit<TNewsBlock, '_id'> & { imageFile: File | null };
export type TNewsEdit = Omit<TNews, 'blocks'> & {
  posterFile: File | null;
  blocks: TNewsBlocksEdit[];
};
