'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { News } from '@/services/news';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { handlerErrorDB } from '@/services/mongodb/error';
import { errorLogger } from '@/errors/error';
import type { ServerResponse, TClientMeta } from '@/types/index.interface';
import type { TNewsGetOneDto, TNewsInteractiveDto } from '@/types/dto.types';
import { PermissionsService } from '@/services/Permissions';
import { checkUserAccess } from '@/libs/utils/auth/checkUserPermission';

type ParamsNews = {
  idUserDB?: string;
  page?: number;
  docsOnPage?: number;
  query?: Partial<{ [K in keyof TNewsGetOneDto]: TNewsGetOneDto[K] }>;
};

/**
 * Получение данных новости с БД.
 */
export async function getNewsOne({
  urlSlug,
  idUserDB,
}: {
  urlSlug: string;
  idUserDB?: string;
}): Promise<TNewsGetOneDto | null | undefined> {
  const news = new News();
  const response = await news.getOne({ urlSlug, idUserDB });

  if (!response.ok) {
    return null;
  }

  return response.data;
}

/**
 * Серверный экшен подсчета просмотра новости с _id:idNews.
 */
export async function countView(idNews: string): Promise<void> {
  try {
    if (!idNews) {
      return;
    }
    // Учет просмотра новости.
    const news = new News();
    await news.countView({ idNews });
  } catch (error) {
    errorLogger(error);
  }
}

/**
 * Отправка заполненной формы создания новости на сервер.
 */
export const postNews = async (formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);

    const author = session?.user.idDB;
    if (!author) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    const news = new News();
    const response = await news.create({ formData, author });

    revalidatePath(`/`);

    return response;
  } catch (error) {
    return handlerErrorDB(error);
  }
};

/**
 * Отправка заполненной формы обновления новости на сервер.
 */
export const putNewsOne = async (formData: FormData) => {
  try {
    const { userIdDB } = await checkUserAccess('moderation.news.edit');

    // Извлекаем urlSlug (уникальный идентификатор новости) из formData.
    const urlSlug = formData.get('urlSlug');
    // Проверяем, что urlSlug существует и имеет тип строки.
    if (!urlSlug || typeof urlSlug !== 'string') {
      throw new Error('Некорректный или отсутствующий urlSlug!');
    }

    // Создаем экземпляр сервиса для работы с новостями.
    const newsService = new News();

    // Обновляем новость с помощью метода сервиса
    const response = await newsService.put({ formData, moderator: userIdDB });

    // Перегенерируем кэш для главной страницы после изменения данных.
    revalidatePath(`/`);

    // Возвращаем ответ сервера
    return response;
  } catch (error) {
    return handlerErrorDB(error);
  }
};

/**
 * Серверный экшен получения новостей с БД.
 */
export async function getNews({ idUserDB, page, docsOnPage, query }: ParamsNews = {}) {
  try {
    const news = new News();
    const response: ServerResponse<null | {
      news: TNewsGetOneDto[];
      currentPage: number;
      quantityPages: number;
    }> = await news.getMany({
      idUserDB,
      page,
      docsOnPage,
      query,
    });

    if (!response.ok) {
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    errorLogger(error);
  }
}

export async function setLike(idNews: string): Promise<ServerResponse<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    // Проверка, что новость загружена с сервера.
    if (!idNews) {
      throw new Error('Не найдена новость!');
    }

    // Проверка авторизации пользователя.
    if (!idUserDB) {
      throw new Error('Необходима авторизация и наличие idUserDB!');
    }

    const news = new News();

    const res = await news.countLike({ idUserDB, idNews });
    return res;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

/**
 * Серверный экшен, получает данные для интерактивного блока новости idNews.TNewsInteractiveDto
 */
export async function getInteractive(
  idNews: string
): Promise<ServerResponse<null> | ServerResponse<TNewsInteractiveDto>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    // Проверка, что новость загружена с сервера.
    if (!idNews) {
      throw new Error('Во входных параметрах нет idNews!');
    }

    const newsService = new News();
    const response = await newsService.getInteractive({ idUserDB, idNews });

    return response;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

/**
 * Серверный экшен, удаления новости.
 */
export async function deleteNews({
  urlSlug,
  client,
}: {
  urlSlug: string;
  client: TClientMeta;
}): Promise<ServerResponse<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    // Проверка авторизации пользователя.
    if (!idUserDB) {
      throw new Error('Необходима авторизация и наличие idUserDB!');
    }

    const permission = 'moderation.news.delete';

    const newsService = new News();
    const res = await PermissionsService.checkPermission({
      entity: 'news',
      urlSlug,
      idUserDB,
      permission,
    });

    if (!res.ok) {
      throw new Error(res.message);
    }

    const response = await newsService.delete({ urlSlug, moderator: idUserDB, client });

    // Ревалидация данных после удаления новости.
    revalidatePath('/');

    return response;
  } catch (error) {
    return handlerErrorDB(error);
  }
}
