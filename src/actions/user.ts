'use server';

import { parseError } from '@/errors/parse';
import { errorHandlerClient } from './error-handler';
import { UserService } from '@/services/user';
import { TUserDtoPublic } from '@/types/dto.types';
import { ResponseServer, TProfileForRegistration } from '@/types/index.interface';

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
    })) as ResponseServer<TUserDtoPublic | null>;

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
