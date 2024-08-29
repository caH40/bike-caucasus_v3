import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconResults from '@/components/Icons/IconResults';
import { getChampionships } from '@/actions/championship';
import { TOptions } from '@/types/index.interface';
import FormSelectionChampionship from '@/components/UI/Forms/FormSelectionChampionship/FormSelectionChampionship';

/**
 * Страница выбора Чемпионата и заезда для работы с финишным протоколом.
 */
export default async function ChampionshipRaceForProtocolPage() {
  const championships = await getChampionships({});

  if (!championships.data) {
    return (
      <>
        <h2>Не найдены Чемпионаты!</h2>
        <p>{championships.message}</p>
      </>
    );
  }

  const options: TOptions[] = championships.data.map((champ, index) => ({
    id: index,
    translation: champ.name,
    name: champ.urlSlug,
  }));

  return (
    <>
      <TitleAndLine
        hSize={1}
        title="Выбор Чемпионата для работы с финишным протоколом"
        Icon={IconResults}
      />
      <FormSelectionChampionship options={options} />
    </>
  );
}
