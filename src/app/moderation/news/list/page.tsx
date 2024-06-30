import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getNews } from '@/actions/news';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import TableNewsList from '@/components/Table/TableNewsList/TableNewsList';
import IconNewspaper from '@/components/Icons/IconNewspaper';

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
      {responseWithNews && (
        <TableNewsList news={responseWithNews.news} idUserDB={session?.user.idDB} />
      )}
    </>
  );
}
