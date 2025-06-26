import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconChampionship from '@/components/Icons/IconChampionship';

import { fetchChampionshipCreated, getToursAndSeries } from '@/actions/championship';
import { getOrganizerForModerate } from '@/actions/organizer';
import t from '@/locales/ru/moderation/championship.json';

import CContainerChampionshipForms from '@/components/ClientContainers/CContainerChampionshipForms/CContainerChampionshipForms';
import { getRacePointsTables } from '@/actions/race-points-table';
import { getAllDistances } from '@/actions/distance';

export const dynamic = 'force-dynamic';

/**
 * Страница создания Чемпионатов.
 */
export default async function ChampionshipCreatePage() {
  const [{ data: organizer }, racePointsTables, distances] = await Promise.all([
    getOrganizerForModerate(),
    getRacePointsTables(),
    getAllDistances(),
  ]);

  if (!organizer) {
    return <h1>{t.notFoundOrganizer}</h1>;
  }

  const parentChampionships = await getToursAndSeries({ organizerId: organizer._id });

  return (
    <>
      <TitleAndLine title={t.titleCreate} hSize={1} Icon={IconChampionship} />

      <CContainerChampionshipForms
        organizer={organizer}
        fetchChampionshipCreated={fetchChampionshipCreated}
        parentChampionships={parentChampionships.data || []}
        racePointsTables={racePointsTables?.data || []}
        distances={distances.data || []}
      />
    </>
  );
}
