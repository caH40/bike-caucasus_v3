import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import TableTrailList from '@/components/Table/TableTrailList/TableTrailList';
import { getTrails } from '@/actions/trail';

type Props = {};

/**
 * Страница со списком всех Маршрутов для редактирования.
 * Для Модераторов Маршрутов отображаются маршруты, созданные ими.
 * Для Администраторов все Маршруты.
 */
export default async function TrailsListPage({}: Props) {
  const session = await getServerSession(authOptions);

  const responseWithTrails = await getTrails({
    bikeType: null,
    region: null,
    difficultyLevel: null,
  });

  return (
    <>
      <TitleAndLine hSize={1} title="Список маршрутов, созданных пользователем" />
      {responseWithTrails.data && (
        <TableTrailList trails={responseWithTrails.data} idUserDB={session?.user.idDB} />
      )}
    </>
  );
}
