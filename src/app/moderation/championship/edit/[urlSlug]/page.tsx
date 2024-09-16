import { getServerSession } from 'next-auth';

import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormChampionship from '@/components/UI/Forms/FormChampionship/FormChampionship';
import IconChampionship from '@/components/Icons/IconChampionship';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getChampionship, getToursAndSeries, putChampionship } from '@/actions/championship';
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
  const parentChampionships = await getToursAndSeries({ organizerId: organizer._id });

  return (
    <>
      <TitleAndLine title="Редактирование Чемпионата" hSize={1} Icon={IconChampionship} />
      <FormChampionship
        putChampionship={putChampionship}
        championshipForEdit={championship.data}
        parentChampionships={parentChampionships.data || []}
        organizer={organizer}
      />
    </>
  );
}
