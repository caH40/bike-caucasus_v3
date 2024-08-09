import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { News } from '@/services/news';
import FormNews from '@/components/UI/Forms/FormNews/FormNews';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconNewspaper from '@/components/Icons/IconNewspaper';

/**
 * Страница создания новости
 */
export default async function NewsCreatePage() {
  const session = await getServerSession(authOptions);

  const author = session?.user.idDB;
  if (!author) {
    throw new Error('Нет авторизации, нет idDB!');
  }

  /**
   * Отправка заполненной формы создания новости на сервер.
   */
  const fetchNewsCreated = async (formData: FormData) => {
    'use server';

    const news = new News();
    const response = await news.create({ formData, author });

    revalidatePath(`/`);

    return response;
  };

  return (
    <>
      <TitleAndLine title={'Создание новости'} hSize={1} Icon={IconNewspaper} />
      <FormNews fetchNewsCreated={fetchNewsCreated} />
    </>
  );
}
