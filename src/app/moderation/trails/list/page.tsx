import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getTrails } from '@/actions/trail';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconRoute from '@/components/Icons/IconRoute';
import ContainerTableTrailsModeration from '@/components/Table/Containers/TrailsModeration/ContainerTableTrailsModeration';

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
      <ContainerTableTrailsModeration
        trails={responseWithTrails.data}
        idUserDB={session?.user.idDB}
      />
    </>
  );
}
