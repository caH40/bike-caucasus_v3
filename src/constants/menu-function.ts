import IconCreate from '@/components/Icons/IconCreate';
import IconEdit from '@/components/Icons/IconEdit';
import IconView from '@/components/Icons/IconView';

import type { TMenuOnPage } from '@/types/index.interface';

/**
 * Кнопки для меню на странице Чемпионата /championships
 */
export const buttonsMenuChampionshipPage = (urlSlug: string): TMenuOnPage[] => [
  {
    id: 0,
    name: 'Описание',
    classes: [],
    href: `/championships/${urlSlug}`,
    permission: null,
    icon: IconCreate,
  },
  {
    id: 1,
    name: 'Зарегистрированные',
    classes: [],
    href: `/championships/registered/${urlSlug}`,
    permission: null,
    icon: IconEdit,
  },
  {
    id: 2,
    name: 'Результаты',
    classes: [],
    href: `/championships/results/${urlSlug}`,
    permission: null,
    icon: IconView,
  },
  {
    id: 3,
    name: 'Регистрация',
    classes: [],
    href: `/championships/registration/${urlSlug}`,
    permission: null,
    icon: IconView,
  },
  {
    id: 4,
    name: 'Все Чемпионаты',
    classes: [],
    href: `/championships`,
    permission: null,
    icon: IconView,
  },
];
