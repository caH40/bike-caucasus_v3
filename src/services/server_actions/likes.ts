'use server';

import { revalidatePath } from 'next/cache';

import { News } from '@/services/news';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

type Params = {
  idNews: string | undefined;
};

export async function setLike({ idNews }: Params): Promise<undefined | { message: string }> {
  'use server';
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    // Проверка, что новость загружена с сервера.
    if (!idNews) {
      return { message: 'Не найдена новость!' };
    }

    // Проверка авторизации пользователя.
    if (!idUserDB) {
      return { message: 'Необходима авторизация!' };
    }

    const news = new News();

    await news.countLike({ idUserDB, idNews });

    revalidatePath('/');
  } catch (error) {
    console.error('Ошибка в setLike'); // eslint-disable-line
  }
}
