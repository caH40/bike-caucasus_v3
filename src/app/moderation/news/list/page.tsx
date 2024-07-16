import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getNews } from '@/actions/news';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconNewspaper from '@/components/Icons/IconNewspaper';
import ContainerTableNewsModeration from '@/components/Table/Containers/NewsModeration/ContainerTableNewsModeration';

/**
 * Страница со списком всех новостей для редактирования.
 * Для Модераторов Новостей отображаются новости, созданные ими.
 * Для Администраторов все новости.
 */
export default async function NewsListPage() {
  const session = await getServerSession(authOptions);

  const responseWithNews = await getNews();

  return (
    <>
      <TitleAndLine
        hSize={1}
        title="Список новостей, созданных пользователем"
        Icon={IconNewspaper}
      />
      <ContainerTableNewsModeration
        news={responseWithNews?.news || []}
        idUserDB={session?.user.idDB}
      />
    </>
  );
}
