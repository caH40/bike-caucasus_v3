'use client';

import { toast } from 'sonner';

import MenuOnPage from '../MenuOnPage/MenuOnPage';
import type { TMenuOnPage } from '@/types/index.interface';
import { usePathname } from 'next/navigation';

/**
 * Меню на странице account/profile
 */
export default function MenuAccountProfile() {
  const path = usePathname();

  // в разработке
  const onDev = () => toast.info('В разработке');

  const buttons: TMenuOnPage[] = [
    {
      id: 0,
      name: 'Профиль',
      classes: [],
      href: '/account/profile',
    },
    {
      id: 1,
      name: 'Команда',
      classes: [],
      href: '/account/team',
    },
    {
      id: 2,
      name: 'Аккаунт',
      classes: [],
      href: '/account/details',
    },
    {
      id: 3,
      name: 'Разное',
      classes: [],
      onClick: onDev,
    },
  ];

  // выделение активной страницы
  buttons.forEach((btn) => {
    if (path === btn.href) {
      btn.classes.push('active');
    }
  });

  return <MenuOnPage buttons={buttons} />;
}
