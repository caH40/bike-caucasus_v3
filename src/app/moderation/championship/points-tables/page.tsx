import IconChampionship from '@/components/Icons/IconChampionship';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

export default async function PointsTablesPage() {
  return (
    <TitleAndLine
      title="Таблицы начисления очков для серий заездов"
      hSize={1}
      Icon={IconChampionship}
    />
  );
}
