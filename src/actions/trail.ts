'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { Trail } from '@/services/Trail';
import { handlerErrorDB } from '@/services/mongodb/error';
import { TNewsInteractiveDto, TTrailDto } from '@/types/dto.types';
import { ResponseServer } from '@/types/index.interface';
import { getServerSession } from 'next-auth';

/**
 * Получение данных маршрута с БД.
 */
export async function getTrail(urlSlug: string): Promise<TTrailDto | null | undefined> {
  'use server';
  const session = await getServerSession(authOptions);

  const idUserDB = session?.user.idDB;

  const trailsService = new Trail();
  const response = await trailsService.getOne(urlSlug, idUserDB);

  if (!response.ok) {
    return null;
  }

  return response.data;
}

export async function setLike(idDocument: string): Promise<ResponseServer<null>> {
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    // Проверка, что новость загружена с сервера.
    if (!idDocument) {
      throw new Error('Не найден маршрут!');
    }

    // Проверка авторизации пользователя.
    if (!idUserDB) {
      throw new Error('Необходима авторизация и наличие idUserDB!');
    }

    const trail = new Trail();

    const res = await trail.countLike({ idUserDB, idTrail: idDocument });
    return res;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

type ParamsGetInteractive = {
  idDocument: string;
  idUserDB?: string | undefined;
};

/**
 * Серверный экшен, получает данные для интерактивного блока маршрута idNews.TNewsInteractiveDto
 */
export async function getInteractive({
  idDocument,
}: ParamsGetInteractive): Promise<ResponseServer<null> | ResponseServer<TNewsInteractiveDto>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    const trailService = new Trail();
    const response = await trailService.getInteractive({ idUserDB, idTrail: idDocument });

    return response;
  } catch (error) {
    return handlerErrorDB(error);
  }
}
