'use server';

import { getServerSession } from 'next-auth';

import { parseError } from '@/errors/parse';
import { errorHandlerClient } from './error-handler';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { CommentService } from '@/services/Comment';
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
