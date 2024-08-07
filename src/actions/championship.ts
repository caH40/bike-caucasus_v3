'use server';

import { getServerSession } from 'next-auth';

import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

import type { ResponseServer, TCloudConnect } from '@/types/index.interface';

const bucketName = process.env.VK_AWS_BUCKET_NAME || 'bike-caucasus';

/**
 * Экшен отправки созданной формы Чемпионата.
 */
export async function fetchChampionshipCreated(
  formData: FormData
): Promise<ResponseServer<null>> {
  try {
    console.log(formData);

    const session = await getServerSession(authOptions);

    // Проверка авторизации и наличия idUserDB.
    const creator = session?.user.idDB;
    if (!creator) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Проверка наличия прав на создание Чемпионата.
    if (
      !session.user.role.permissions.some(
        (elm) => elm === 'moderation.championship.create' || elm === 'all'
      )
    ) {
      throw new Error('У вас нет прав для создания Организатора!');
    }

    const cloudOptions: TCloudConnect = {
      cloudName: 'vk',
      domainCloudName: 'hb.vkcs.cloud',
      bucketName,
    };

    return { data: null, ok: true, message: 'test' };
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
