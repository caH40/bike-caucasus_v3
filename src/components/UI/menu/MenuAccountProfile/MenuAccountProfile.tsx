'use client';

import { toast } from 'sonner';

import MenuOnPage from '../MenuOnPage/MenuOnPage';
import type { TMenuOnPage } from '@/types/index.interface';

/**
 * Меню на странице account/profile
 */
export default function MenuAccountProfile() {
  // в разработке
  const onDev = () => toast.info('В разработке');

  const buttons: TMenuOnPage[] = [
    {
      id: 0,
      name: 'Профиль',
      classes: ['btn', 'top'],
      href: '/account/profile',
    },
    {
      id: 1,
      name: 'Команда',
      classes: ['btn'],
      href: '/account/team',
    },
    {
      id: 2,
      name: 'Аккаунт',
      classes: ['btn'],
      href: '/account/details',
    },
    {
      id: 3,
      name: 'Разное',
      classes: ['btn', 'bottom'],
      onClick: onDev,
    },
  ];

  return MenuOnPage(buttons);
}
