import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getTrails } from '@/actions/trail';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import TableTrailList from '@/components/Table/TableTrailList/TableTrailList';
import IconRoute from '@/components/Icons/IconRoute';

/**
 * Страница со списком всех Маршрутов для редактирования.
 * Для Модераторов Маршрутов отображаются маршруты, созданные ими.
 * Для Администраторов все Маршруты.
 */
export default async function TrailsListPage() {
  const session = await getServerSession(authOptions);

  const responseWithTrails = await getTrails({
    bikeType: null,
    region: null,
    difficultyLevel: null,
    search: '',
  });

  return (
    <>
      <TitleAndLine
        hSize={1}
        title="Список маршрутов, созданных пользователем"
        Icon={IconRoute}
      />
      {responseWithTrails.data && (
        <TableTrailList trails={responseWithTrails.data} idUserDB={session?.user.idDB} />
      )}
    </>
  );
}
