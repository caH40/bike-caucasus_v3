'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ChampionshipService } from '@/services/Championship';
import type { TDtoChampionship } from '@/types/dto.types';
import type { ResponseServer } from '@/types/index.interface';

/**
 * Экшен получения данных запрашиваемого Чемпионата.
 */
export async function getChampionship({
  urlSlug,
  forModeration,
}: {
  urlSlug: string;
  forModeration?: boolean;
}): Promise<ResponseServer<TDtoChampionship | null>> {
  try {
    const session = await getServerSession(authOptions);

    if (forModeration) {
      // Проверка наличия прав на редактирование Чемпионатов.
      if (
        !session?.user.role.permissions.some(
          (elm) => elm === 'moderation.championship.edit' || elm === 'all'
        )
      ) {
        throw new Error('У вас нет прав для редактирования Чемпионатов!');
      }
    }

    const championshipService = new ChampionshipService();
    const championship = await championshipService.getOne({ urlSlug });

    if (!championship.ok) {
      throw new Error('Ошибка при получении запрашиваемого Чемпионата');
    }

    return championship;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получения данных Чемпионатов.
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

    const championshipService = new ChampionshipService();

    const res = await championshipService.post({ serializedFormData: formData, creator });

    revalidatePath('/moderation/championship');
    revalidatePath('championship');

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Серверный экшен, удаления Чемпионата.
 */
export async function deleteChampionship(urlSlug: string): Promise<ResponseServer<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    // Проверка авторизации пользователя.
    if (!idUserDB) {
      throw new Error('Необходима авторизация и наличие idUserDB!');
    }

    const championshipService = new ChampionshipService();
    const response = await championshipService.delete({ urlSlug });

    revalidatePath('/championship');
    revalidatePath('/moderation/championship');

    return response;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

/**
 * Серверный экшен, обновления данных Чемпионата.
 */
export async function putChampionship(
  serializedFormData: FormData
): Promise<ResponseServer<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);

    // Проверка авторизации и наличия idUserDB.
    const idUserDB = session?.user.idDB;
    if (!idUserDB) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Проверка наличия прав на создание Чемпионата.
    if (
      !session.user.role.permissions.some(
        (elm) => elm === 'moderation.championship.edit' || elm === 'all'
      )
    ) {
      throw new Error('У вас нет прав для редактирования Чемпионата!');
    }

    const championshipService = new ChampionshipService();

    const response = await championshipService.put({ serializedFormData });

    revalidatePath('/championship');
    revalidatePath('/moderation/championship');

    return response;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получения всех чемпионатов Туров и Серий для запрашиваемого организатора.
 */
export async function getToursAndSeries({
  organizerId,
}: {
  organizerId: string;
}): Promise<ResponseServer<{ _id: string; name: string }[] | null>> {
  'use server';
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

    const championshipService = new ChampionshipService();
    const response = await championshipService.getTourAndSeries({ organizerId });

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
