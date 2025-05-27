import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export const checkUserAccess = async (
  requiredPermission: string | string[]
): Promise<{ userIdDB: string }> => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.idDB) {
    throw new Error('Нет авторизации, нет idDB!');
  }

  const userPermissions = session.user.role?.permissions ?? [];

  const hasPermission = Array.isArray(requiredPermission)
    ? requiredPermission.some(
        (perm) => userPermissions.includes(perm) || userPermissions.includes('all')
      )
    : userPermissions.includes(requiredPermission) || userPermissions.includes('all');

  if (!hasPermission) {
    throw new Error('У вас нет прав для выполнения этой операции!');
  }

  return { userIdDB: session.user.idDB };
};
