import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getNewsOne } from '@/app/news/[urlSlug]/page';
import FormNews from '@/components/UI/Forms/FormNews/FormNews';
import Wrapper from '@/components/Wrapper/Wrapper';
import { News } from '@/services/news';
import { TNewsGetOneDto } from '@/types/dto.types';

const bucketName = process.env.VK_AWS_BUCKET_NAME || 'bike-caucasus';

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
    const response = await newsService.put(formData, {
      cloudName: 'vk',
      domainCloudName: 'hb.vkcs.cloud',
      bucketName,
    });

    revalidatePath(`/`);

    return response;
  };

  return (
    <Wrapper title="Редактирование новости">
      {news ? (
        <FormNews fetchNewsEdited={fetchNewsEdited} newsForEdit={news} />
      ) : (
        <span>Не получены данные Новости для редактирования</span>
      )}
    </Wrapper>
  );
}
