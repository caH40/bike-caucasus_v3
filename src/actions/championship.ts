'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { getOrganizerForModerate } from './organizer';
import { PermissionsService } from '@/services/Permissions';
import { ChampionshipCategories } from '@/services/ChampionshipCategories';
import { ChampionshipRaces } from '@/services/ChampionshipRaces';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ChampionshipService } from '@/services/Championship';

// types
import type { TDtoChampionship, TToursAndSeriesDto } from '@/types/dto.types';
import type {
  ServerResponse,
  TClientMeta,
  TPutCategoriesParams,
  TPutRacesParams,
} from '@/types/index.interface';
import type { TChampionshipTypes } from '@/types/models.interface';

/**
 * Экшен получения данных запрашиваемого Чемпионата.
 */
export async function getChampionship({
  urlSlug,
  forModeration,
}: {
  urlSlug: string;
  forModeration?: boolean;
}): Promise<ServerResponse<TDtoChampionship | null>> {
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
  needTypes,
  organizerId,
  parentChampionshipId,
}: {
  forModeration?: boolean;
  needTypes?: TChampionshipTypes[];
  organizerId?: string; // если есть organizerId значит необходимы чемпионаты, созданные организатором, для отображения на странице организатора.
  parentChampionshipId?: string;
}): Promise<ServerResponse<TDtoChampionship[] | null>> {
  try {
    const session = await getServerSession(authOptions);
    const userIdDB = session?.user.idDB;

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
    const championships = await championshipService.getMany({
      userIdDB,
      forModeration,
      needTypes,
      organizerId,
      parentChampionshipId,
    });

    if (!championships.ok) {
      throw new Error('Ошибка при получении списка Чемпионатов');
    }

    return championships;
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
): Promise<ServerResponse<null>> {
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
    const res = await championshipService.post({
      serializedFormData: formData,
      moderator: creator,
    });

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
export async function deleteChampionship({
  urlSlug,
  client,
}: {
  urlSlug: string;
  client: TClientMeta;
}): Promise<ServerResponse<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);
    const userIdDB = session?.user.idDB;

    // Проверка авторизации пользователя.
    if (!userIdDB) {
      throw new Error('Необходима авторизация и наличие idUserDB!');
    }

    const championshipService = new ChampionshipService();
    // Проверка наличия запрашиваемого чемпионата.
    const championship = await championshipService.getOne({ urlSlug });
    if (!championship.data) {
      throw new Error(`Чемпионат не найден!`);
    }

    if (championship.data.status === 'completed') {
      throw new Error(
        `Чемпионат "${championship.data.name}" завершен! Запрет на удаление завершенного чемпионата!`
      );
    }

    // Запрос Организатора на проверку соответствия Организатора, который создал удаляемый Чемпионат и Организатора с userId пользователя, который запрашивает удаление.
    const organizer = await getOrganizerForModerate();

    if (!organizer.data) {
      throw new Error('Не найден Организатор!');
    }

    // Если проходит проверка, то пробрасывается ошибка, а следующий код не выполняется.
    const responsePermission = await PermissionsService.checkPermissionOrganizer({
      organizerId: organizer.data?._id,
      championshipId: championship.data?.organizer._id,
      userIdDB,
    });

    if (!responsePermission.ok) {
      throw new Error(responsePermission.message);
    }

    // Удаление чемпионата.
    const response = await championshipService.delete({ urlSlug, moderator: userIdDB, client });

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
export async function putChampionship({
  dataSerialized,
  urlSlug,
}: {
  dataSerialized: FormData;
  urlSlug: string;
}): Promise<ServerResponse<null>> {
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
    const champ = await championshipService.getOne({ urlSlug });
    if (champ.data?.status === 'completed') {
      throw new Error(
        `Чемпионат "${champ.data.name}" завершен! Запрет на редактирование завершенного чемпионата!`
      );
    }

    const response = await championshipService.put({
      serializedFormData: dataSerialized,
      moderator: idUserDB,
    });

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
}): Promise<ServerResponse<TToursAndSeriesDto[] | null>> {
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
    const response = await championshipService.getToursAndSeries({ organizerId });

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен обновление пакетов категорий для чемпионата.
 */
export async function putCategories({
  dataSerialized,
  urlSlug,
  organizerId,
}: TPutCategoriesParams): Promise<ServerResponse<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);

    // Проверка авторизации и наличия idUserDB.
    const creator = session?.user.idDB;
    if (!creator) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Проверка наличия прав на редактирование категорий Чемпионата.
    // Доступ разрешён, если у пользователя есть одно из разрешений из списка allowedPermissions.
    const allowedPermissions = ['all', 'moderation.championship.create'];
    const canEdit = session.user.role.permissions.some((p) => allowedPermissions.includes(p));
    if (!canEdit) {
      throw new Error('У вас нет прав для изменения категорий Чемпионата!');
    }

    const championshipService = new ChampionshipService();
    const categoriesService = new ChampionshipCategories();
    const { data } = await championshipService.getOne({ urlSlug });

    if (!data) {
      throw new Error(
        `Чемпионат с urlSlug:${urlSlug} не найден — невозможно сохранить изменения в категории!`
      );
    }

    // Проверка, что редактируемый чемпионат действительно принадлежит организатору,
    // от имени которого выполняется операция. Это предотвращает несанкционированное
    // редактирование чемпионатов, принадлежащих другим организаторам.
    if (data.organizer._id !== organizerId) {
      throw new Error('У вас нет прав для изменения данного Чемпионата!');
    }

    const response = await categoriesService.updateAll({
      dataSerialized,
      championshipId: data._id,
      moderator: creator,
    });

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен обновление заездов для чемпионата.
 */
export async function putRaces({
  dataSerialized,
  urlSlug,
  organizerId,
}: TPutRacesParams): Promise<ServerResponse<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);

    // Проверка авторизации и наличия idUserDB.
    const creator = session?.user.idDB;
    if (!creator) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Проверка наличия прав на редактирование категорий Чемпионата.
    // Доступ разрешён, если у пользователя есть одно из разрешений из списка allowedPermissions.
    const allowedPermissions = ['all', 'moderation.championship.create'];
    const canEdit = session.user.role.permissions.some((p) => allowedPermissions.includes(p));
    if (!canEdit) {
      throw new Error('У вас нет прав для изменения заездов Чемпионата!');
    }

    const championshipService = new ChampionshipService();
    const racesService = new ChampionshipRaces();
    const { data } = await championshipService.getOne({ urlSlug });

    if (!data) {
      throw new Error(
        `Чемпионат с urlSlug:${urlSlug} не найден — невозможно сохранить изменения в категории!`
      );
    }

    // Проверка, что редактируемый чемпионат действительно принадлежит организатору,
    // от имени которого выполняется операция. Это предотвращает несанкционированное
    // редактирование чемпионатов, принадлежащих другим организаторам.
    if (data.organizer._id !== organizerId) {
      throw new Error('У вас нет прав для изменения данного Чемпионата!');
    }

    const response = await racesService.updateAll({
      dataSerialized,
      championshipId: data._id,
      moderator: creator,
    });

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
