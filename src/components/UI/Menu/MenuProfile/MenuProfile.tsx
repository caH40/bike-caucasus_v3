'use client';

import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import type { TMenuOnPage } from '@/types/index.interface';
import IconEditOld from '@/components/Icons/IconEditOld';
import IconShare from '@/components/Icons/IconShare';
import IconEllipsisHorCircle from '@/components/Icons/IconEllipsisHorCircle';

type Params = {
  profileId: number;
};

/**
 * Меню на странице профиля
 */
export default function MenuProfile({ profileId }: Params) {
  const { data: session } = useSession();

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
      name: 'Личный кабинет',
      classes: [],
      href: '/account/profile',
      isMyButton: true,
      permission: null,
      icon: IconEditOld,
    },
    {
      id: 1,
      name: 'Разное',
      classes: [],
      onClick: onDev,
      permission: null,
      icon: IconEllipsisHorCircle,
    },
    {
      id: 2,
      name: 'Поделиться ссылкой',
      classes: [],
      onClick: shareUrl,
      permission: null,
      icon: IconShare,
    },
  ];

  const buttonsFiltered = buttons.filter(
    (button) => !button.isMyButton || (profileId === session?.user.id && button.isMyButton)
  );

  return <MenuOnPage buttons={buttonsFiltered} />;
}
