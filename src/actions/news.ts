'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { News } from '@/services/news';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { handlerErrorDB } from '@/services/mongodb/error';
import { errorLogger } from '@/errors/error';
import type { ResponseServer } from '@/types/index.interface';
import type { TNewsGetOneDto, TNewsInteractiveDto } from '@/types/dto.types';

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
    // Получаем текущую сессию пользователя с использованием next-auth.
    const session = await getServerSession(authOptions);

    // Проверяем, есть ли у пользователя ID в базе данных.
    const idUserDB = session?.user.idDB;
    if (!idUserDB) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Извлекаем urlSlug (уникальный идентификатор новости) из formData.
    const urlSlug = formData.get('urlSlug');
    // Проверяем, что urlSlug существует и имеет тип строки.
    if (!urlSlug || typeof urlSlug !== 'string') {
      throw new Error('Некорректный или отсутствующий urlSlug!');
    }

    // Определяем требуемое разрешение для редактирования новости.
    const permission = 'moderation.news.edit';

    // Создаем экземпляр сервиса для работы с новостями.
    const newsService = new News();

    // Проверяем права пользователя на редактирование данной новости.
    const res = await newsService.checkPermission({ urlSlug, idUserDB, permission });

    // Если прав недостаточно, возвращаем ошибку.
    if (!res.ok) {
      throw new Error(res.message);
    }

    // Обновляем новость с помощью метода сервиса
    const response = await newsService.put(formData);

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
    const response: ResponseServer<null | {
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

export async function setLike(idNews: string): Promise<ResponseServer<null>> {
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
): Promise<ResponseServer<null> | ResponseServer<TNewsInteractiveDto>> {
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
export async function deleteNews(urlSlug: string): Promise<ResponseServer<null>> {
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
    const res = await newsService.checkPermission({ urlSlug, idUserDB, permission });

    if (!res.ok) {
      throw new Error(res.message);
    }

    const response = await newsService.delete({ urlSlug, idUserDB });

    return response;
  } catch (error) {
    return handlerErrorDB(error);
  }
}
