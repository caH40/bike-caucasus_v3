import IconChampionship from '@/components/Icons/IconChampionship';
import IconDocument from '@/components/Icons/IconDocument';
import IconInfo from '@/components/Icons/IconInfo';
import IconRegistration from '@/components/Icons/IconRegistration';
import IconResults from '@/components/Icons/IconResults';
import IconStages from '@/components/Icons/IconStages';
import IconTeam from '@/components/Icons/IconTeam';

import type { TMenuOnPage } from '@/types/index.interface';

type Params = {
  urlSlug: string;
  parentChampionshipUrlSlug?: string;
  hiddenItemNames?: string[];
};

/**
 * Кнопки для меню на странице Чемпионата /championships
 * Используются как серверный компонент.
 */
export const buttonsMenuChampionshipPage = ({
  urlSlug,
  parentChampionshipUrlSlug,
  hiddenItemNames = [],
}: Params): TMenuOnPage[] =>
  [
    {
      id: 0,
      name: 'Описание',
      classes: [],
      href: `/championships/${urlSlug}`,
      permission: null,
      icon: IconInfo,
    },
    {
      id: 1,
      name: 'Зарегистрированные',
      classes: [],
      href: `/championships/registered/${urlSlug}`,
      permission: null,
      icon: IconTeam,
    },
    {
      id: 2,
      name: 'Результаты',
      classes: [],
      href: `/championships/results/${urlSlug}`,
      permission: null,
      icon: IconResults,
    },
    {
      id: 3,
      name: 'Генеральная классификация',
      classes: [],
      href: `/championships/results/${urlSlug}`,
      permission: null,
      icon: IconResults,
    },
    {
      id: 4,
      name: 'Регистрация',
      classes: [],
      href: `/championships/registration/${urlSlug}`,
      permission: null,
      icon: IconRegistration,
    },
    {
      id: 5,
      name: 'Документы',
      classes: [],
      href: `/championships/documents/${urlSlug}`,
      permission: null,
      icon: IconDocument,
    },
    {
      id: 6,
      name: 'Этапы Серии заездов',
      classes: [],
      href: `/championships/${parentChampionshipUrlSlug}`,
      permission: null,
      icon: IconStages,
    },
    {
      id: 7,
      name: 'Этапы Тура',
      classes: [],
      href: `/championships/${parentChampionshipUrlSlug}`,
      permission: null,
      icon: IconStages,
    },
    {
      id: 8,
      name: 'Все Чемпионаты',
      classes: [],
      href: `/championships`,
      permission: null,
      icon: IconChampionship,
    },
  ].filter((item) => !hiddenItemNames.includes(item.name));
