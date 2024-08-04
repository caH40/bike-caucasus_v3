'use server';

import { OrganizerService } from '@/services/Organizer';
import type { TDtoOrganizer } from '@/types/dto.types';
import type { ResponseServer, TCloudConnect } from '@/types/index.interface';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

const bucketName = process.env.VK_AWS_BUCKET_NAME || 'bike-caucasus';

/**
 * Получение данных организатора или по _id Организатора или по _id(creatorId) создателя Организатора.
 */
export async function getOrganizer({
  _id,
  creatorId,
}: {
  _id?: string;
  creatorId?: string;
}): Promise<ResponseServer<TDtoOrganizer | null>> {
  try {
    // Проверка, что только один параметр предоставлен
    if ((!_id && !creatorId) || (_id && creatorId)) {
      throw new Error('Необходимо передать только один из параметров: _id или creatorId.');
    }

    let query = {} as { _id: string } | { creatorId: string };

    if (_id) {
      query = { _id };
    } else if (creatorId) {
      query = { creatorId };
    }

    const organizerService = new OrganizerService();
    const res = await organizerService.getOne(query);

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Акшен отправки созданной формы Организатора
 */
export async function fetchOrganizerCreated(formData: FormData): Promise<ResponseServer<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);

    // Проверка авторизации и наличия idUserDB.
    const creator = session?.user.idDB;
    if (!creator) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Проверка наличия прав на создание Организатора.
    if (
      !session.user.role.permissions.some(
        (elm) => elm === 'moderation.organizer.create' || elm === 'all'
      )
    ) {
      throw new Error('У вас нет прав для создания Организатора!');
    }

    const cloudOptions: TCloudConnect = {
      cloudName: 'vk',
      domainCloudName: 'hb.vkcs.cloud',
      bucketName,
    };

    const organizerService = new OrganizerService();
    const res = await organizerService.post({
      serializedFormData: formData,
      cloudOptions,
      creator,
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
