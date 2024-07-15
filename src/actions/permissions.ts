'use server';

import { PermissionsService } from '@/services/Permissions';
import { errorHandlerClient } from '@/actions/error-handler';
import { parseError } from '@/errors/parse';
import { TPermissionDto } from '@/types/dto.types';
import { ResponseServer } from '@/types/index.interface';
import { revalidatePath } from 'next/cache';

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
 * Серверный экшен создания Разрешения (доступа) к ресурсам сайта.
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

    revalidatePath('/admin/roles');

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

    revalidatePath('/admin/roles');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return { data: null, ok: false, message: 'Ошибка в серверном экшене deletePermission' };
  }
}
