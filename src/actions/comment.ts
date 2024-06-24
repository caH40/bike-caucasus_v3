'use server';

import { getServerSession } from 'next-auth';

import { parseError } from '@/errors/parse';
import { errorHandlerClient } from './error-handler';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { CommentService } from '@/services/Comment';
import { ResponseServer } from '@/types/index.interface';
import { handlerErrorDB } from '@/services/mongodb/error';
import type { TCommentDto } from '@/types/dto.types';

export async function postComment(
  text: string,
  document: { _id: string; type: 'news' | 'trail' }
) {
  try {
    const session = await getServerSession(authOptions);

    const idUserDB = session?.user.idDB;

    if (!idUserDB) {
      throw new Error('Необходима авторизация!');
    }

    const commentService = new CommentService();

    const res = await commentService.post({ authorIdDB: idUserDB, text, document });

    return { isSaved: res.ok };
  } catch (error) {
    errorHandlerClient(parseError(error));
    return { isSaved: false };
  }
}

export async function getComments({
  document,
  idUserDB,
}: {
  document: { _id: string; type: 'news' | 'trail' };
  idUserDB: string | undefined;
}): Promise<TCommentDto[]> {
  try {
    const commentService = new CommentService();

    const res = await commentService.getMany({ idUserDB, document });

    // Ошибка обрабатывается в сервисе, если нет ошибки то возвращаем массив комментариев.
    if (res.ok) {
      return res.data || [];
    } else {
      return [];
    }
  } catch (error) {
    errorHandlerClient(parseError(error));
    return [];
  }
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

    const commentService = new CommentService();

    const res = await commentService.countLike({ idUserDB, idComment: idDocument });
    return res;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

/**
 * Удаление комментария.
 * @param idDocument
 * @returns
 */
export async function deleteComment(idComment: string): Promise<ResponseServer<null>> {
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    // Проверка авторизации пользователя.
    if (!idUserDB) {
      throw new Error('Необходима авторизация и наличие idUserDB!');
    }

    const commentService = new CommentService();

    const res = await commentService.delete({ idUserDB, idComment });

    return res;
  } catch (error) {
    return handlerErrorDB(error);
  }
}
