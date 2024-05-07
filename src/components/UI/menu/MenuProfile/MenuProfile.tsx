'use client';

import { toast } from 'sonner';
import MenuOnPage from '../MenuOnPage/MenuOnPage';
import type { TMenuOnPage } from '@/types/index.interface';

/**
 * Меню на странице профиля
 */
export default function MenuProfile() {
  // сохранение ссылки в буфер обмена
  const shareUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success('Ссылка на аккаунт скопирована в буфер обмена'));
  };

  // в разработке
  const onDev = () => toast.info('В разработке');

  const buttons: TMenuOnPage[] = [
    {
      id: 0,
      name: 'Настройки',
      position: 'top',
      classes: ['btn', 'top'],
      href: '/account/profile',
    },
    {
      id: 1,
      name: 'Разное',
      position: 'middle',
      classes: ['btn'],
      onClick: onDev,
    },
    {
      id: 2,
      name: 'Поделиться ссылкой',
      position: 'bottom',
      classes: ['btn', 'bottom'],
      onClick: shareUrl,
    },
  ];

  return MenuOnPage(buttons);
}
