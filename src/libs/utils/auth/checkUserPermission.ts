'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { Organizer } from '@/database/mongodb/Models/Organizer';
import { Types } from 'mongoose';

export async function checkUserAccess(
  requiredPermission: string | string[]
): Promise<{ userIdDB: string }> {
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
}

/**
 * Проверка, является ли пользователь userIdDB организатором.
 */
export async function checkIsOrganizer(userIdDB: string): Promise<{ _id: string }> {
  const organizer = await Organizer.findOne({ creator: userIdDB }, { _id: true }).lean<{
    _id: Types.ObjectId;
  }>();

  if (!organizer) {
    throw new Error('Вы не являетесь Организатором Чемпионатов. Обратитесь в поддержку!');
  }

  return { _id: organizer._id.toString() };
}
