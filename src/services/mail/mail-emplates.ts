import { htmlNewUser } from './letters/newUser';
import { htmlRefreshPassword } from './letters/refreshpassword';
import { htmlRegistration } from './letters/registration';
import { htmlResetPassword } from './letters/resetpassword';

import { TMailServiceParams, TMailTarget } from '@/types/index.interface';

const { NEXT_PUBLIC_SERVER_FRONT } = process.env;

export const mailTemplates: Record<
  TMailTarget,
  {
    subject: string;
    getHtml: ({
      email,
      auth,
      additional,
    }: Omit<TMailServiceParams, 'target'> & { date: string }) => string;
    requirePassword?: boolean;
  }
> = {
  registration: {
    subject: 'Подтверждение регистрации на сайте bike-caucasus.ru',
    getHtml: ({ auth, email, date }) => {
      if (!auth || !auth.password) {
        throw new Error('Нет пароля');
      }
      if (!NEXT_PUBLIC_SERVER_FRONT) {
        throw new Error('Нет данные по front server');
      }
      return htmlRegistration(
        auth.username,
        auth.password,
        email,
        auth.token,
        NEXT_PUBLIC_SERVER_FRONT,
        date
      );
    },
    requirePassword: true,
  },
  resetPassword: {
    subject: 'Сброс пароля на сайте bike-caucasus.ru',
    getHtml: ({ auth, email, date }) => {
      if (!auth) {
        throw new Error('Нет данных для формирования письма!');
      }
      if (!NEXT_PUBLIC_SERVER_FRONT) {
        throw new Error('Нет данные по front server');
      }
      return htmlResetPassword(
        auth.username,
        email,
        auth.token,
        NEXT_PUBLIC_SERVER_FRONT,
        date
      );
    },
  },
  savedNewPassword: {
    subject: 'Обновление пароля профиля на сайте bike-caucasus.ru',
    getHtml: ({ auth, date }) => {
      if (!auth) {
        throw new Error('Нет данных для формирования письма!');
      }
      if (!auth.password) {
        throw new Error('Нет пароля');
      }
      return htmlRefreshPassword(date, auth.username, auth.password);
    },
    requirePassword: true,
  },
  newUser: {
    subject: 'Зарегистрировался новый пользователь',
    getHtml: ({ additional }) => {
      return htmlNewUser({ additional });
    },
    requirePassword: true,
  },
};
