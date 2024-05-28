// Dto для запросов из коллекции User.

import type { TRoleDto, TUserDto, TUserDtoPublic } from '@/types/dto.types';
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
export function dtoGetUserPublic(user: TUserDto, ageCategory: string): TUserDtoPublic {
  // eslint-disable-next-line no-unused-vars
  const { email, phone, ...userDto } = {
    ...user,
    provider: user.provider?.name
      ? {
          name: user.provider.name,
          image: user.provider.name,
        }
      : null,
    person: {
      firstName: user.person.firstName,
      patronymic: user.person.patronymic,
      lastName: user.person.lastName,
      ageCategory,
      gender: user.person.gender,
      bio: user.person.bio,
    },
  };

  return userDto;
}

/**
 * Дто Роли пользователя.
 */
export function dtoGetRole(role: TRoleModel): TRoleDto {
  return {
    ...role,
    _id: String(role._id),
  };
}
