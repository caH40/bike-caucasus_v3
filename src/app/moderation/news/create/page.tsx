import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { News } from '@/services/news';
import Wrapper from '@/components/Wrapper/Wrapper';
import FormNewsEdit from '@/components/UI/Forms/FormNewsEdit/FormNewsEdit';

const bucketName = process.env.VK_AWS_BUCKET_NAME || 'bike-caucasus';

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
    const response = await news.create(
      formData,
      {
        cloudName: 'vk',
        domainCloudName: 'hb.vkcs.cloud',
        bucketName,
      },
      author
    );

    revalidatePath(`/`);

    return response;
  };

  return (
    <Wrapper title={'Создание новости'}>
      <FormNewsEdit fetchNewsCreated={fetchNewsCreated} />
    </Wrapper>
  );
}
