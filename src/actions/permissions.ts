'use server';

import { PermissionsService } from '@/services/Permissions';
import { errorHandlerClient } from '@/actions/error-handler';
import { parseError } from '@/errors/parse';
import { TPermissionDto, TRoleDto } from '@/types/dto.types';
import { ResponseServer, TFormRole } from '@/types/index.interface';
import { revalidatePath } from 'next/cache';
import { handlerErrorDB } from '@/services/mongodb/error';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

const permissionsService = new PermissionsService();

/**
 * Серверный экшен получения всех Разрешений (доступов) к ресурсам сайта.
 */
export async function getPermissions(): Promise<TPermissionDto[] | null> {
  try {
    const res = await permissionsService.getMany();

    if (!res.ok) {
      throw new Error(res.message);
    }

    return res.data;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return null;
  }
}

/**
 * Серверный экшен получения Разрешения (доступа) к ресурсам сайта.
 */
export async function getPermission({ _id }: { _id: string }): Promise<TPermissionDto | null> {
  try {
    const res = await permissionsService.getOne({ _id });

    if (!res.ok) {
      throw new Error(res.message);
    }

    return res.data;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return null;
  }
}

/**
 * Серверный экшен создания Разрешения (доступа) к ресурсам сайта.
 */
export async function putPermission({
  _id,
  name,
  description,
}: {
  _id: string;
  name: string;
  description: string;
}): Promise<ResponseServer<null>> {
  try {
    const res = await permissionsService.put({ _id, name, description });

    revalidatePath('/');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return { data: null, ok: false, message: 'Ошибка в серверном экшене putPermission' };
  }
}

/**
 * Серверный экшен обновления данных Разрешения (доступа) к ресурсам сайта.
 */
export async function postPermission({
  name,
  description,
}: {
  name: string;
  description: string;
}): Promise<ResponseServer<null>> {
  try {
    const res = await permissionsService.post({ name, description });

    revalidatePath('/');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return { data: null, ok: false, message: 'Ошибка в серверном экшене postPermission' };
  }
}

/**
 * Серверный экшен удаления Разрешения (доступа) к ресурсам сайта.
 */
export async function deletePermission({
  _id,
}: {
  _id: string;
}): Promise<ResponseServer<null>> {
  try {
    const res = await permissionsService.delete({ _id });

    revalidatePath('/');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return { data: null, ok: false, message: 'Ошибка в серверном экшене deletePermission' };
  }
}

/**
 * Серверный экшен создания Роли.
 */
export async function postRole({
  newRole,
}: {
  newRole: TFormRole;
}): Promise<ResponseServer<null>> {
  try {
    const res = await permissionsService.postRole({ newRole });

    revalidatePath('/');

    return res;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

/**
 * Серверный экшен получения Роли пользователей на сайте.
 */
export async function getRole({
  _id,
}: {
  _id: string;
}): Promise<ResponseServer<TRoleDto | null>> {
  try {
    const res = await permissionsService.getRole({
      _id,
    });

    if (!res.ok) {
      throw new Error(res.message);
    }

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Серверный экшен получения всех Ролей пользователей на сайте.
 */
export async function getRoles(): Promise<ResponseServer<TRoleDto[] | null>> {
  try {
    const res = await permissionsService.getRoles();

    if (!res.ok) {
      throw new Error(res.message);
    }

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Серверный экшен удаления Роли пользователя на сайте.
 */
export async function deleteRole({ _id }: { _id: string }): Promise<ResponseServer<null>> {
  try {
    const res = await permissionsService.deleteRole({ _id });

    revalidatePath('/');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return { data: null, ok: false, message: 'Ошибка в серверном экшене deleteRole' };
  }
}

/**
 * Серверный экшен обновления данных Роли пользователей на сайте.
 */
export async function putRole({
  roleEdited,
}: {
  roleEdited: TFormRole;
}): Promise<ResponseServer<null>> {
  try {
    const res = await permissionsService.putRole({ roleEdited });

    revalidatePath('/');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return { data: null, ok: false, message: 'Ошибка в серверном экшене putRole' };
  }
}

/**
 * Серверный экшен проверки на соответствие Организатора, который создал модерируемы Чемпионат и Организатора с userId пользователя, который запрашивает действие на модерацию. Модерировать может администратор.
 */
export async function checkPermissionOrganizer({
  organizerId,
  championshipId,
}: {
  organizerId: string;
  championshipId: string;
}): Promise<ResponseServer<null>> {
  try {
    const session = await getServerSession(authOptions);
    const userIdDB = session?.user.idDB;

    // Проверка авторизации.
    if (!userIdDB) {
      throw new Error('Не получен _id модератора Чемпионата');
    }

    const responsePermission = await PermissionsService.checkPermissionOrganizer({
      organizerId,
      championshipId,
      userIdDB,
    });

    return responsePermission;
  } catch (error) {
    return handlerErrorDB(error);
  }
}
