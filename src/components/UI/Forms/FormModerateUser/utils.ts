import { TRoleDto } from '@/types/dto.types';
import type { TOptions } from '@/types/index.interface';

/**
 * Создание массива option для Select выбора Роли.
 */
export const createOptionsRoles = (roles: TRoleDto[]): TOptions[] => {
  const options = roles.map((role, index) => ({
    id: index,
    translation: role.name,
    name: role.name,
  }));

  return options;
};
