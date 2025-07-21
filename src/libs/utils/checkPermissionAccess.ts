import { TSessionUser } from '@/types/index.interface';

type Params = {
  permission: string;
  user: TSessionUser;
};

/**
 * Проверка наличия доступа на основе сессии пользователя.
 * @param {string | null} permission - Требуемое разрешение.
 * @returns {boolean} - Возвращает true, если пользователь имеет доступ, иначе false.
 */
export function checkPermissionAccess({ user, permission }: Params): boolean {
  if (!user.role) {
    return false;
  }

  const userPermissions = user.role.permissions;

  // Для админа всё открыто.
  if (userPermissions.includes('all')) {
    return true;
  }

  if (userPermissions.includes(permission)) {
    return true;
  }

  return false;
}
