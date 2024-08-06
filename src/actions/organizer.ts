'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { OrganizerService } from '@/services/Organizer';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { Organizer as OrganizerModel } from '@/database/mongodb/Models/Organizer';
import type { TDtoOrganizer } from '@/types/dto.types';
import type { ResponseServer, TCloudConnect } from '@/types/index.interface';

const bucketName = process.env.VK_AWS_BUCKET_NAME || 'bike-caucasus';

/**
 * Получение данных организатора или по _id Организатора или по _id(creatorId) создателя Организатора.
 */
export async function getOrganizer({
  urlSlug,
  creatorId,
}: {
  urlSlug?: string;
  creatorId?: string;
}): Promise<ResponseServer<TDtoOrganizer | null>> {
  try {
    // Проверка, что только один параметр предоставлен
    if ((!urlSlug && !creatorId) || (urlSlug && creatorId)) {
      throw new Error('Необходимо передать только один из параметров: _id или creatorId.');
    }

    let query = {} as { urlSlug: string } | { creatorId: string };

    if (urlSlug) {
      query = { urlSlug };
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
 * Получение Организаторов Чемпионатов.
 */
export async function getOrganizers(): Promise<ResponseServer<TDtoOrganizer[] | null>> {
  try {
    const organizerService = new OrganizerService();
    const res = await organizerService.getMany();

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен отправки формы Организатора с измененными данными.
 */
export async function fetchOrganizerEdited({
  dataSerialized,
  organizerId,
}: {
  dataSerialized: FormData;
  organizerId: string;
}): Promise<ResponseServer<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);

    // Проверка авторизации и наличия idUserDB.
    const creator = session?.user.idDB;
    if (!creator) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Проверка на существования Организатора с _id, созданного creator.
    const organizerDB = await OrganizerModel.findOne({
      _id: organizerId,
      creator,
    });
    if (!organizerDB) {
      throw new Error(
        `Организатор с таким _id: ${organizerId}, созданного пользователем с _id: ${creator} уже существует`
      );
    }

    // Проверка наличия прав на создание Организатора.
    if (
      !session.user.role.permissions.some(
        (elm) => elm === 'moderation.organizer.edit' || elm === 'all'
      )
    ) {
      throw new Error('У вас нет прав для редактирования Организатора!');
    }

    const cloudOptions: TCloudConnect = {
      cloudName: 'vk',
      domainCloudName: 'hb.vkcs.cloud',
      bucketName,
    };

    const organizerService = new OrganizerService();
    const res = await organizerService.put({
      serializedFormData: dataSerialized,
      cloudOptions,
    });

    revalidatePath('/moderation/organizer/edit');
    revalidatePath('/organizer');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
/**
 * Экшен отправки созданной формы Организатора
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

    revalidatePath('/organizer');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
