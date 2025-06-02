import { buttonsMenuChampionshipPage } from '@/constants/menu-function';

// types
import { TChampionshipTypes } from '@/types/models.interface';

type Params = {
  parentChampionshipType: TChampionshipTypes | undefined;
  parentChampionshipUrlSlug?: string;
  urlSlug: string;
};

/**
 * Возвращает необходимые сущности для страниц чемпионата.
 */
export default function getChampionshipPageData({
  parentChampionshipUrlSlug,
  parentChampionshipType,
  urlSlug,
}: Params) {
  const hasStages =
    !!parentChampionshipType &&
    (parentChampionshipType === 'series' || parentChampionshipType === 'tour');

  const buttons = buttonsMenuChampionshipPage({
    urlSlug,
    parentChampionshipUrlSlug,
    parentChampionshipType: hasStages ? parentChampionshipType : undefined,
  });

  // Если серия или тур, то не отображать пункт меню "Финишные протоколы".
  const hiddenItemNames = hasStages ? ['Финишные протоколы'] : [];

  return { hiddenItemNames, buttons };
}
