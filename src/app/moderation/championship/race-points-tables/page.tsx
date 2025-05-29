import { getOrganizerForModerate } from '@/actions/organizer';
import { getRacePointsTables } from '@/actions/race-points-table';
import IconChampionship from '@/components/Icons/IconChampionship';
import ContainerRacePointsTable from '@/components/Table/Containers/RacePointsTable/ContainerRacePointsTable';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import t from '@/locales/ru/moderation/championship.json';

export default async function RacePointsTablesPage() {
  const { data: organizer } = await getOrganizerForModerate();

  if (!organizer) {
    return <h1>{t.notFoundOrganizer}</h1>;
  }

  const racePointsTables = await getRacePointsTables();

  return (
    <>
      <TitleAndLine
        title="Таблицы начисления очков для серий заездов"
        hSize={1}
        Icon={IconChampionship}
      />

      {racePointsTables.data && (
        <ContainerRacePointsTable
          racePointsTables={racePointsTables.data}
          organizerId={organizer._id}
        />
      )}
    </>
  );
}
