import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import ContainerTableChampionshipModeration from '@/components/Table/Containers/ChampionshipsModeration/ContainerTableChampionshipModeration';
import IconChampionship from '@/components/Icons/IconChampionship';
import { getChampionships } from '@/actions/championship';

/**
 * Страница со списком всех Чемпионатов Организатора для редактирования.
 * Для Организатора отображаются Чемпионаты, созданные ими.
 * Для Администраторов все Чемпионаты.
 */
export default async function ChampionshipListPage() {
  const championships = await getChampionships({ forModeration: true });

  return (
    <>
      <TitleAndLine
        hSize={1}
        title="Список Чемпионатов, созданных пользователем (Организатором)"
        Icon={IconChampionship}
      />
      {championships.data && (
        <ContainerTableChampionshipModeration championships={championships.data} />
      )}
    </>
  );
}
