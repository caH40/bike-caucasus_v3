import { buttonsMenuChampionshipPage } from '@/constants/menu-function';

// types
import { TChampionshipTypes } from '@/types/models.interface';
import { isChampionshipWithStages } from './championship';

type Params = {
  parentChampionshipType: TChampionshipTypes | undefined; // Если это этап.
  parentChampionshipUrlSlug?: string; // Если это этап.
  urlSlug: string;
  championshipType: TChampionshipTypes;
};

/**
 * Возвращает необходимые сущности для страниц чемпионата.
 */
export default function getChampionshipPageData({
  parentChampionshipUrlSlug,
  parentChampionshipType,
  urlSlug,
  championshipType,
}: Params) {
  // Выбор скрываемых кнопок в навигационном меню чемпионатов. Скрывать "Тура" или "Серия заездов".
  let hiddenStageItemNames = ['Этапы Серии заездов', 'Этапы Тура'];

  if (parentChampionshipType) {
    hiddenStageItemNames =
      parentChampionshipType === 'series' ? ['Этапы Тура'] : ['Серии заездов'];
  }

  `Этапы ${parentChampionshipType === 'series' ? 'Серии заездов' : 'Тура'}`;

  const hasStages = isChampionshipWithStages(championshipType);
  // Выбор скрываемых кнопок в навигационном меню чемпионатов. У тура и серии скрывается кнопка "Результаты".
  const hiddenResultsItemName = hasStages ? 'Результаты' : 'Генеральная классификация';

  // Выбор скрываемых кнопок в навигационном меню чемпионатов. У тура и серии скрывается кнопка "Результаты".
  const hiddenRegisteredItemNames = ['tour', 'series'].includes(championshipType)
    ? ['Зарегистрированные', 'Регистрация']
    : [];

  const buttons = buttonsMenuChampionshipPage({
    urlSlug,
    parentChampionshipUrlSlug,
    hiddenItemNames: [
      ...hiddenStageItemNames,
      hiddenResultsItemName,
      ...hiddenRegisteredItemNames,
    ],
  });

  // Если серия или тур, то не отображать пункт меню "Финишные протоколы".
  const hiddenItemNames = hasStages
    ? ['Финишные протоколы']
    : ['Обновление данных генеральной классификации'];

  return { hiddenItemNames, buttons };
}
