import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import FormNewsCreate from '@/components/UI/Forms/FormNewsCreate/FormNewsCreate';

import { News } from '@/services/news';
import { getServerSession } from 'next-auth';

/**
 * Страница создания новости
 */
export default async function NewsCreatePage() {
  const session = await getServerSession(authOptions);

  const author = session?.user.idDB;
  if (!author) {
    throw new Error('Нет авторизации, нет idDB!');
  }

  const fetchNewsCreated = async (formData: FormData) => {
    'use server';

    const news = new News();
    const response = await news.create(
      formData,
      {
        cloudName: 'vk',
        domainCloudName: 'hb.vkcs.cloud',
        bucketName: 'bike-caucasus',
      },
      author
    );

    return response;
  };

  return (
    <div>
      <FormNewsCreate fetchNewsCreated={fetchNewsCreated} />
    </div>
  );
}
