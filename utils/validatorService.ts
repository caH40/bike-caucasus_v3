import type { FieldValues, UseFormRegister } from 'react-hook-form';

interface FieldValuesCustom extends FieldValues {
  username: string;
  email: string;
  password: string;
}

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
