'use server';

import { getServerSession } from 'next-auth';

import { News } from '@/services/news';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { handlerErrorDB } from '../mongodb/error';
import type { ResponseServer } from '@/types/index.interface';
import type { TNewsInteractiveDto } from '@/types/dto.types';

type ParamsSetLike = {
  idNews: string | undefined;
};

export async function setLike({ idNews }: ParamsSetLike): Promise<ResponseServer<null>> {
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
      throw new Error('Необходима авторизация!');
    }

    const news = new News();

    const res = await news.countLike({ idUserDB, idNews });
    return res;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

type ParamsGetInteractive = {
  idNews: string | undefined;
  idUserDB?: string | undefined;
};

/**
 * Серверный экшен, получает данные для интерактивного блока новости idNews.TNewsInteractiveDto
 */
export async function getInteractive({
  idNews,
}: ParamsGetInteractive): Promise<ResponseServer<null> | ResponseServer<TNewsInteractiveDto>> {
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
