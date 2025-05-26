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
import type { ServerResponse } from '@/types/index.interface';

/**
 * Получение данных организатора для публичного отображения.
 */
export async function getOrganizer({
  urlSlug,
}: {
  urlSlug: string;
}): Promise<ServerResponse<TDtoOrganizer | null>> {
  try {
    const organizerService = new OrganizerService();
    const res = await organizerService.getOne({ urlSlug });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
/**
 * Проверка наличия Организатора у Пользователя.
 */
export async function checkHasOrganizer(): Promise<
  ServerResponse<{ urlSlug: string | null } | null>
> {
  try {
    const session = await getServerSession(authOptions);
    const userIdDB = session?.user.idDB;

    // Проверка авторизации.
    if (!userIdDB) {
      throw new Error('Нет авторизации!');
    }

    const { permissions } = session.user.role;

    // Проверка авторизации.
    if (
      !permissions.some((permission) =>
        ['moderation.organizer.create', 'all'].includes(permission)
      )
    ) {
      throw new Error('Нет Разрешений для создания/модерации Организатора!');
    }

    const organizerService = new OrganizerService();
    const res = await organizerService.checkHasOrganizer({ userIdDB });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Получить Организатора по creatorId или id модератора для последующей модерации.
 */
export async function getOrganizerForModerate(): Promise<ServerResponse<TDtoOrganizer | null>> {
  try {
    const session = await getServerSession(authOptions);
    const userIdDB = session?.user.idDB;

    // Проверка авторизации.
    if (!userIdDB) {
      throw new Error('Не получен _id модератора Чемпионата');
    }

    const organizerService = new OrganizerService();
    const res = await organizerService.getOneForModerate({ userIdDB });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Получение Организаторов Чемпионатов.
 */
export async function getOrganizers(): Promise<ServerResponse<TDtoOrganizer[] | null>> {
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
}): Promise<ServerResponse<null>> {
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

    const organizerService = new OrganizerService();
    const res = await organizerService.put({
      serializedFormData: dataSerialized,
    });

    revalidatePath('/moderation/organizer/edit');
    revalidatePath('/organizers');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
/**
 * Экшен отправки созданной формы Организатора
 */
export async function fetchOrganizerCreated(formData: FormData): Promise<ServerResponse<null>> {
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

    const organizerService = new OrganizerService();
    const res = await organizerService.post({
      serializedFormData: formData,
      creator,
    });

    revalidatePath('/organizers');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
