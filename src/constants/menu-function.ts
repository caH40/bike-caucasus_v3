import IconChampionship from '@/components/Icons/IconChampionship';
import IconDocument from '@/components/Icons/IconDocument';
import IconInfo from '@/components/Icons/IconInfo';
import IconRegistration from '@/components/Icons/IconRegistration';
import IconResults from '@/components/Icons/IconResults';
import IconTeam from '@/components/Icons/IconTeam';

import type { TMenuOnPage } from '@/types/index.interface';

/**
 * Кнопки для меню на странице Чемпионата /championships
 * Используются как серверный компонент.
 */
export const buttonsMenuChampionshipPage = (urlSlug: string): TMenuOnPage[] => [
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
    name: 'Регистрация',
    classes: [],
    href: `/championships/registration/${urlSlug}`,
    permission: null,
    icon: IconRegistration,
  },
  {
    id: 4,
    name: 'Документы',
    classes: [],
    href: `/championships/documents/${urlSlug}`,
    permission: null,
    icon: IconDocument,
  },
  {
    id: 5,
    name: 'Все Чемпионаты',
    classes: [],
    href: `/championships`,
    permission: null,
    icon: IconChampionship,
  },
];
