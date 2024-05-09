import type { UseFormRegisterReturn } from 'react-hook-form';

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
  autoComplete: string;
  type: string;
  label: string;
  disabled?: boolean;
  validationText?: string;
  defaultValue?: string;
  register: UseFormRegisterReturn; // FieldValues
  min?: string;
  max?: string;
};

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
  firstName: string;
  patronymic?: string;
  lastName: string;
  birthday?: string;
  gender: string;
  city?: string;
  phone?: string;
  bio?: string;
  [key: string]: any;
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
 * Ответ с сервиса Базы Данных
 */
export type MessageServiceDB<T> = {
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
};
