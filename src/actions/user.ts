'use server';

import { parseError } from '@/errors/parse';
import { errorHandlerClient } from './error-handler';
import { UserService } from '@/services/user';
import { TProfileSimpleDto, TUserDto, TUserDtoPublic } from '@/types/dto.types';
import {
  ServerResponse,
  TProfileForRegistration,
  TUserModeratedData,
} from '@/types/index.interface';
import { handlerErrorDB } from '@/services/mongodb/error';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

const userService = new UserService();

/**
 * Получение данных райдера.
 */
export async function getProfile({
  userId,
  isPrivate,
}: {
  userId: number;
  isPrivate?: boolean;
}): Promise<ServerResponse<TUserDto | TUserDtoPublic | null>> {
  try {
    const { data: profile } = await userService.getProfile({ id: userId, isPrivate });

    if (!profile) {
      throw new Error('Пользователь не найден!');
    }

    return {
      data: profile,
      ok: true,
      message: 'Данные профиля пользователя',
    };
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Изменение данных пользователя администратором.
 */
export async function putUserModeratedData({
  user,
}: {
  user: TUserModeratedData;
}): Promise<ServerResponse<null>> {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user.role.name;

    // Проверка роли. Редактировать данные пользователей могут только администраторы сайта.
    if (role !== 'admin') {
      throw new Error('У вас нет прав для редактирования данных Пользователя!');
    }

    const response = await userService.putUserModeratedData({ user });

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получения данных райдера, в частности для Регистрации на Чемпионат.
 */
export async function getProfileForReg({
  idDB,
}: {
  idDB: string | undefined;
}): Promise<TProfileForRegistration | null> {
  try {
    // Если нет idDB, значит нет аутентификации.
    if (!idDB) {
      return null;
    }

    const userService = new UserService();
    const res = (await userService.getProfile({
      idDB,
    })) as ServerResponse<TUserDtoPublic | null>;

    if (!res.data) {
      throw new Error(res.message);
    }

    const gender = res.data.person.gender;
    const profile = {
      firstName: res.data.person.firstName || null,
      lastName: res.data.person.lastName || null,
      ageCategory: res.data.person.ageCategory || null,
      city: res.data.city || null,
      gender,
    };

    return profile;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return null;
  }
}

/**
 * Экшен получения данных райдера, в частности для Регистрации на Чемпионат.
 */

export async function findUsers({
  lastNameSearch,
}: {
  lastNameSearch: string;
}): Promise<ServerResponse<TProfileSimpleDto[] | null>> {
  try {
    // Минимальное количество символов для поиска.
    const minLength = 3;

    if (lastNameSearch.length < minLength) {
      return {
        data: [],
        ok: true,
        message: `Поиск осуществляется при длине запроса более ${minLength} символов`,
      };
    }

    const userService = new UserService();
    const res = await userService.findUsers(lastNameSearch);

    if (!res.data) {
      throw new Error(res.message);
    }

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
