import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getNews } from '@/services/server_actions/news';
import TitleAndLine from '@/components/UI/TitleAndLine/TitleAndLine';
import TableNewsList from '@/components/Table/TableNewsList/TableNewsList';

type Props = {};

/**
 * Страница со списком всех новостей для редактирования.
 * Для Модераторов Новостей отображаются новости, созданные ими.
 * Для Администраторов все новости.
 */
export default async function NewsListPage({}: Props) {
  const session = await getServerSession(authOptions);

  const news = await getNews();

  return (
    <div>
      <TitleAndLine hSize={1} title="Список новостей, созданных пользователем" />
      {news && <TableNewsList news={news} idUserDB={session?.user.idDB} />}
    </div>
  );
}
