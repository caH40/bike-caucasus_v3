import { htmlRefreshPassword } from './letters/refreshpassword';
import { htmlRegistration } from './letters/registration';
import { htmlResetPassword } from './letters/resetpassword';

import { TMailTarget } from '@/types/index.interface';

const { NEXT_PUBLIC_SERVER_FRONT } = process.env;

export const mailTemplates: Record<
  TMailTarget,
  {
    subject: string;
    getHtml: (params: {
      username: string;
      email: string;
      token: string;
      password?: string;
      date: string;
    }) => string;
    requirePassword?: boolean;
  }
> = {
  registration: {
    subject: 'Подтверждение регистрации на сайте bike-caucasus.ru',
    getHtml: ({ username, password, email, token, date }) => {
      if (!password) {
        throw new Error('Нет пароля');
      }
      if (!NEXT_PUBLIC_SERVER_FRONT) {
        throw new Error('Нет данные по front server');
      }
      return htmlRegistration(username, password, email, token, NEXT_PUBLIC_SERVER_FRONT, date);
    },
    requirePassword: true,
  },
  resetPassword: {
    subject: 'Сброс пароля на сайте bike-caucasus.ru',
    getHtml: ({ username, email, token, date }) => {
      if (!NEXT_PUBLIC_SERVER_FRONT) {
        throw new Error('Нет данные по front server');
      }
      return htmlResetPassword(username, email, token, NEXT_PUBLIC_SERVER_FRONT, date);
    },
  },
  savedNewPassword: {
    subject: 'Обновление пароля профиля на сайте bike-caucasus.ru',
    getHtml: ({ username, password, date }) => {
      if (!password) {
        throw new Error('Нет пароля');
      }
      return htmlRefreshPassword(date, username, password);
    },
    requirePassword: true,
  },
};
