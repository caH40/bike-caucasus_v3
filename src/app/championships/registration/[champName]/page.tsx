import { getChampionship } from '@/actions/championship';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { championshipTypesMap } from '@/constants/championship';
import { TParentChampionshipForClient } from '@/types/index.interface';
import { TChampionshipTypes } from '@/types/models.interface';

type Props = {
  params: {
    champName: string;
  };
};

export default async function Registration({ params: { champName } }: Props) {
  const { data: championship } = await getChampionship({ urlSlug: champName });
  if (!championship) {
    return <h2>Не получены данные с сервера о Чемпионате </h2>;
  }

  function getTitle({
    name,
    parentChampionship,
    type,
    stage,
  }: {
    name: string;
    parentChampionship?: TParentChampionshipForClient;
    type: TChampionshipTypes;
    stage: number | null;
  }) {
    switch (type) {
      case 'single': {
        return `Регистрация на Чемпионат ${name}`;
      }

      default: {
        // Если не поступили данные о Родительском чемпионате.
        if (!parentChampionship) {
          return `Регистрация на ${stage} Этап: "${name}"`;
        }

        return `Регистрация на ${stage} Этап: "${name}". ${
          championshipTypesMap.get(parentChampionship.type)?.translation
        } "${parentChampionship.name}"`;
      }
    }
  }

  return (
    <TitleAndLine
      title={getTitle({
        name: championship.name,
        parentChampionship: championship.parentChampionship,
        type: championship.type,
        stage: championship.stage,
      })}
    />
  );
}
