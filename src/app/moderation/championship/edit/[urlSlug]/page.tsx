import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FromChampionship from '@/components/UI/Forms/FromChampionship/FromChampionship';
import IconChampionship from '@/components/Icons/IconChampionship';
import { getChampionship, putChampionship } from '@/actions/championship';
import { getOrganizer } from '@/actions/organizer';

type Props = {
  params: {
    urlSlug: string;
  };
};

/**
 * Страница Редактирования запрашиваемого Чемпионата.
 */
export default async function ChampionshipEditCurrentPage({ params: { urlSlug } }: Props) {
  const session = await getServerSession(authOptions);

  const userIdDB = session?.user.idDB;

  if (!userIdDB) {
    return <h1>Нет авторизации!</h1>;
  }

  const championship = await getChampionship({ urlSlug, forModeration: true });

  const { data: organizer } = await getOrganizer({ creatorId: userIdDB });

  if (!organizer || !championship.data) {
    return (
      <h1>
        Не найден Организатора, перед созданием Чемпионата необходимо создать Организатора!
      </h1>
    );
  }

  return (
    <>
      <TitleAndLine title="Редактирование Чемпионата" hSize={1} Icon={IconChampionship} />
      <FromChampionship
        putChampionship={putChampionship}
        championshipForEdit={championship.data}
        organizer={organizer}
      />
    </>
  );
}
