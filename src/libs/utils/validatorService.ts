import { TFormProfile } from '@/types/index.interface';
import type { FieldValues, UseFormRegister } from 'react-hook-form';

interface FieldValuesCustom extends FieldValues {
  username: string;
  email: string;
  password: string;
}

// interface FieldValuesCustom2 extends FieldValues {
//   firstName: string;
//   email: string;
//   password: string;
// }

/**
 * Валидация поля "Имя пользователя".
 * @param register Функция регистрации поля из библиотеки react-hook-form.
 * @returns Объект настроек валидации для поля "Имя пользователя".
 */
export function validateUsername(register: UseFormRegister<FieldValuesCustom>) {
  return {
    ...register('username', {
      required: 'Это обязательное поле для заполнения',
      minLength: { value: 5, message: 'Username должен быть больше 4х символов' },
      maxLength: { value: 15, message: 'Username не может быть больше 15 символов' },
      pattern: {
        value: /^[a-zA-Z][a-zA-Z0-9._]{4,15}$/i,
        message: 'Логин может состоять из лат. букв, цифр, . и _',
      },
    }),
  };
}

/**
 * Валидация поля "Email".
 * @param register Функция регистрации поля из библиотеки react-hook-form.
 * @returns Объект настроек валидации для поля "Email".
 */
export function validateEmail(register: UseFormRegister<FieldValuesCustom>) {
  return {
    ...register('email', {
      required: 'Это обязательное поле для заполнения',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Некорректный email',
      },
    }),
  };
}

/**
 * Валидация поля "Пароль".
 * @param register Функция регистрации поля из библиотеки react-hook-form.
 * @returns Объект настроек валидации для поля "Пароль".
 */
export function validatePassword(register: UseFormRegister<FieldValuesCustom>) {
  return {
    ...register('password', {
      required: 'Это обязательное поле для заполнения',
      minLength: { value: 6, message: 'Password должен быть больше 5ти символов' },
      maxLength: { value: 15, message: 'Password не может быть больше 15 символов' },
    }),
  };
}

/**
 * Валидация поля "Фамилия пользователя".
 * @param register Функция регистрации поля из библиотеки react-hook-form.
 * @returns Объект настроек валидации для поля "Фамилия пользователя".
 */
export function validateLastName(register: UseFormRegister<TFormProfile>) {
  return {
    ...register('lastName', {
      required: 'Это обязательное поле для заполнения',
      minLength: { value: 2, message: 'Фамилия должна быть больше 1х символа' },
      maxLength: { value: 20, message: 'Фамилия не может быть больше 20 символов' },
    }),
  };
}

/**
 * Валидация поля "Имя пользователя".
 * @param register Функция регистрации поля из библиотеки react-hook-form.
 * @returns Объект настроек валидации для поля "Имя пользователя".
 */
export function validateFirstName(register: UseFormRegister<TFormProfile>) {
  return {
    ...register('firstName', {
      required: 'Это обязательное поле для заполнения',
      minLength: { value: 2, message: 'Имя должна быть больше 1х символа' },
      maxLength: { value: 20, message: 'Имя не может быть больше 20 символов' },
    }),
  };
}

/**
 * Валидация поля "Отчество пользователя".
 * @param register Функция регистрации поля из библиотеки react-hook-form.
 * @returns Объект настроек валидации для поля "Отчество пользователя".
 */
export function validatePatronymic(register: UseFormRegister<TFormProfile>) {
  return {
    ...register('patronymic', {
      required: false,
      minLength: { value: 2, message: 'Отчество должно быть больше 1х символа' },
      maxLength: { value: 20, message: 'Отчество не может быть больше 20 символов' },
    }),
  };
}

/**
 * Валидация поля "День рождения пользователя".
 * @param register Функция регистрации поля из библиотеки react-hook-form.
 *  * @returns Объект настроек валидации для поля "День рождения пользователя".
 */
export function validateBirthday(register: UseFormRegister<TFormProfile>) {
  return {
    ...register('birthday', {
      required: true,
      pattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
    }),
  };
}

/**
 * Валидация поля "Город пользователя".
 * @param register Функция регистрации поля из библиотеки react-hook-form.
 * @returns Объект настроек валидации для поля "Город пользователя".
 */
export function validateCity(register: UseFormRegister<TFormProfile>) {
  return {
    ...register('city', {
      required: false,
      minLength: { value: 2, message: 'Город должен быть больше 1х символа' },
      maxLength: { value: 20, message: 'Город не может быть больше 20 символов' },
    }),
  };
}
