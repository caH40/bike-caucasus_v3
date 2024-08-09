import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getNewsOne } from '@/app/news/[urlSlug]/page';
import { News } from '@/services/news';
import FormNews from '@/components/UI/Forms/FormNews/FormNews';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import type { TNewsGetOneDto } from '@/types/dto.types';

type Props = {
  params: { urlSlug: string };
};

/**
 * Страница редактирования новости.
 */
export default async function NewsEditCurrentPage({ params }: Props) {
  revalidatePath(`/`);
  const session = await getServerSession(authOptions);

  const author = session?.user.idDB;
  if (!author) {
    throw new Error('Нет авторизации, нет idDB!');
  }

  const { urlSlug } = params;
  const news: (TNewsGetOneDto & { posterOldUrl?: string }) | null | undefined =
    await getNewsOne({ urlSlug });
  if (news) {
    // posterOldUrl старого постера, необходим для удаления файла из облака,
    // если был изменен при редактировании новости.
    news.posterOldUrl = news?.poster;
  }

  /**
   * Отправка заполненной формы обновления новости на сервер.
   */
  const fetchNewsEdited = async (formData: FormData) => {
    'use server';

    const newsService = new News();
    const response = await newsService.put(formData);

    revalidatePath(`/`);

    return response;
  };

  return (
    <>
      <TitleAndLine title="Редактирование новости" hSize={1} />
      {news ? (
        <FormNews fetchNewsEdited={fetchNewsEdited} newsForEdit={news} />
      ) : (
        <span>Не получены данные Новости для редактирования</span>
      )}
    </>
  );
}
