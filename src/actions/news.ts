'use server';

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

const bucketName = process.env.VK_AWS_BUCKET_NAME || 'bike-caucasus';

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

    const newsService = new News();

    const response = await newsService.delete(
      { urlSlug, idUserDB },
      {
        cloudName: 'vk',
        domainCloudName: 'hb.vkcs.cloud',
        bucketName,
      }
    );

    return response;
  } catch (error) {
    return handlerErrorDB(error);
  }
}
