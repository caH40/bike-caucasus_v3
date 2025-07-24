// Dto для запросов из коллекции User.

import { getDateTime } from '@/libs/utils/calendar';
import type { TProfileSimpleDto, TRoleDto, TUserDto, TUserDtoPublic } from '@/types/dto.types';
import { TProfileSimpleFromDB } from '@/types/index.interface';
import type { IUserModel, TRoleModel } from '@/types/models.interface';

/**
 * Дто Пользователя User (Профиль пользователя), приватные данные (все данные, кроме пароля).
 */
export function dtoGetUser(user: Omit<IUserModel, 'role'> & { role: TRoleModel }): TUserDto {
  return {
    ...user,
    _id: String(user._id),
    role: dtoGetRole(user.role),
  };
}

/**
 * Дто Пользователя User (Профиль пользователя), данные для публичного доступа.
 * Дата рождения изменена на Возрастную группу, email удалён.
 */
export function dtoGetUserPublic(user: TUserDto, ageCategory: string | null): TUserDtoPublic {
  // eslint-disable-next-line no-unused-vars
  const { email, phone, ...userDto } = {
    ...user,
    provider: user.provider?.name
      ? {
          name: user.provider.name,
          image: user.provider.image,
        }
      : null,
    person: {
      firstName: user.person.firstName,
      patronymic: user.person.patronymic,
      lastName: user.person.lastName,
      ageCategory,
      gender: user.person.gender,
      bio: user.person.bio,
      yearBirthday: user.person.birthday && getDateTime(user.person.birthday).year,
    },
  };

  return userDto;
}
/**
 * Дто массива Пользователей User с минимальным количеством данных.
 */
export function dtoGetUsersSimplePublic(users: TProfileSimpleFromDB[]): TProfileSimpleDto[] {
  return users.map((user) => {
    const yearBirthday = getDateTime(user.person.birthday).year;
    return {
      _id: user._id.toString(),
      firstName: user.person.firstName,
      patronymic: user.person.patronymic,
      lastName: user.person.lastName,
      gender: user.person.gender,
      yearBirthday,
      id: user.id,
      city: user.city,
    };
  });
}

/**
 * Дто Роли пользователя.
 */
export function dtoGetRole(role: TRoleModel): TRoleDto {
  return {
    ...role,
    _id: String(role?._id),
  };
}
