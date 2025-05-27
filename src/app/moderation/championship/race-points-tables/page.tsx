import { getRacePointsTables } from '@/actions/race-points-table';
import IconChampionship from '@/components/Icons/IconChampionship';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

export default async function RacePointsTablesPage() {
  const racePointsTables = await getRacePointsTables();
  console.log(racePointsTables);

  return (
    <TitleAndLine
      title="Таблицы начисления очков для серий заездов"
      hSize={1}
      Icon={IconChampionship}
    />
  );
}
