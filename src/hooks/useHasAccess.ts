'use client';

import { useSession } from 'next-auth/react';

/**
 * Хук для проверки наличия доступа на основе сессии пользователя.
 * @param {string | null} permission - Требуемое разрешение.
 * @returns {boolean} - Возвращает true, если пользователь имеет доступ, иначе false.
 */
export default function useHasAccess(permission: string | null): boolean {
  const { data: session, status } = useSession();

  // Если нет permission, значит страница открыта для всех.
  if (!permission) {
    return true;
  }

  if (status === 'loading') {
    return false;
  }

  if (!session?.user || !session.user.role) {
    return false;
  }

  const userPermissions = session.user.role.permissions;

  // Для админа всё открыто.
  if (userPermissions.includes('all')) {
    return true;
  }

  if (session.user.role.permissions?.includes(permission)) {
    return true;
  }

  return false;
}
