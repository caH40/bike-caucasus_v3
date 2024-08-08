'use server';

import { getServerSession } from 'next-auth';

import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

import type { ResponseServer, TCloudConnect } from '@/types/index.interface';
import { ChampionshipService } from '@/services/Championship';
import { TDtoChampionship } from '@/types/dto.types';

const bucketName = process.env.VK_AWS_BUCKET_NAME || 'bike-caucasus';

/**
 * Экшен отправки созданной формы Чемпионата.
 */
export async function getChampionships({
  forModeration,
}: {
  forModeration?: boolean;
}): Promise<ResponseServer<TDtoChampionship[] | null>> {
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    if (forModeration) {
      // Проверка наличия прав на редактирование Чемпионатов
      // (получения списка созданных Чемпионатов для редактирования).
      if (
        !session?.user.role.permissions.some(
          (elm) => elm === 'moderation.championship.edit' || elm === 'all'
        )
      ) {
        throw new Error('У вас нет прав для редактирования Чемпионатов!');
      }
    }

    const championshipService = new ChampionshipService();
    const championship = await championshipService.getMany({ idUserDB, forModeration });

    if (!championship.ok) {
      throw new Error('Ошибка при получении списка Чемпионатов');
    }

    return championship;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен отправки созданной формы Чемпионата.
 */
export async function fetchChampionshipCreated(
  formData: FormData
): Promise<ResponseServer<null>> {
  try {
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
      throw new Error('У вас нет прав для создания Чемпионата!');
    }

    const cloudOptions: TCloudConnect = {
      cloudName: 'vk',
      domainCloudName: 'hb.vkcs.cloud',
      bucketName,
    };

    const championshipService = new ChampionshipService();

    const res = await championshipService.post({
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
