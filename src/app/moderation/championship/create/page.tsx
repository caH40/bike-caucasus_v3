import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconChampionship from '@/components/Icons/IconChampionship';
import FromChampionship from '@/components/UI/Forms/FromChampionship/FromChampionship';
import { fetchChampionshipCreated, getToursAndSeries } from '@/actions/championship';
import { getOrganizer } from '@/actions/organizer';
import t from '@/locales/ru/moderation/championship.json';

export const dynamic = 'force-dynamic';

/**
 * Страница создания Чемпионатов.
 */
export default async function ChampionshipCreatePage() {
  const session = await getServerSession(authOptions);

  const userIdDB = session?.user.idDB;
  if (!userIdDB) {
    return <h1>Нет авторизации!</h1>;
  }
  const { data: organizer } = await getOrganizer({ creatorId: userIdDB });

  if (!organizer) {
    return <h1>{t.notFoundOrganizer}</h1>;
  }

  const parentChampionships = await getToursAndSeries({ organizerId: organizer._id });

  return (
    <>
      <TitleAndLine title={t.titleCreate} hSize={1} Icon={IconChampionship} />
      <FromChampionship
        organizer={organizer}
        fetchChampionshipCreated={fetchChampionshipCreated}
        parentChampionships={parentChampionships.data || []}
      />
    </>
  );
}
