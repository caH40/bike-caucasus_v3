'use client';

import IconAdmin from '@/components/Icons/IconAdmin';
import IconCalendar from '@/components/Icons/IconCalendar';
import IconChampionship from '@/components/Icons/IconChampionship';
import IconDelete from '@/components/Icons/IconDelete';
import IconDistance from '@/components/Icons/IconDistance';
import IconEditOld from '@/components/Icons/IconEditOld';
import IconOrganizers from '@/components/Icons/IconOrganizers';
import IconRefresh from '@/components/Icons/IconRefresh';
import IconUser from '@/components/Icons/IconUser';
import IconWrench from '@/components/Icons/IconWrench';
import { deleteItem } from '@/components/UI/BlockModeration/delete';
import { upsertItem } from '@/components/UI/BlockModeration/upsert';
import type {
  TClientMeta,
  TEmail,
  TLinkWithImage,
  TMenuOnPage,
  TMenuPopup,
} from '@/types/index.interface';

/**
 * Главное меню навигации сайта в мобильной версии.
 */
export const getNavLinksMobile = (userId: number | undefined) => [
  { id: 0, name: 'Главная', href: '/', permission: null },
  { id: 1, name: 'Вебкамеры', href: '/webcam', permission: null },
  { id: 2, name: 'Маршруты', href: '/trails', permission: null },
  { id: 3, name: 'Календарь', href: '/calendar', permission: null },
  { id: 4, name: 'Чемпионаты', href: '/championships', permission: null },
  { id: 5, name: 'Дистанции', href: '/distances', permission: null },
  {
    id: 6,
    name: 'Профиль',
    href: userId ? `/profile/${userId}` : '/',
    permission: 'authorized',
    icon: IconUser,
  },
  { id: 7, name: 'Организаторы', href: '/organizers', permission: null },
  { id: 8, name: 'Управление', href: '/moderation', permission: 'moderation' },
  { id: 9, name: 'Админ', href: '/admin', permission: 'admin' },
];

/**
 * Меню навигации у Пользователя в Popup.
 */
export const getNavLinksUserPopup = (userId: number | undefined): TMenuPopup[] => [
  {
    id: 0,
    name: 'Профиль',
    href: userId ? `/profile/${userId}` : '/',
    permission: '',
    icon: IconUser,
  },
  {
    id: 1,
    name: 'Управление',
    href: '/moderation',
    permission: 'moderation',
    icon: IconWrench,
  },
  {
    id: 2,
    name: 'Админ',
    href: '/admin',
    permission: 'admin',
    icon: IconAdmin,
  },
];

/**
 * Меню навигации у Чемпионатов в Popup в шапке сайта.
 */
export const getNavLinksChampionshipsPopup = (): TMenuPopup[] => [
  {
    id: 100,
    name: 'Чемпионаты',
    href: '/championships',
    permission: '',
    icon: IconChampionship,
  },
  {
    id: 101,
    name: 'Календарь',
    href: '/calendar',
    permission: '',
    icon: IconCalendar,
  },
  {
    id: 102,
    name: 'Дистанции',
    href: '/distances',
    permission: '',
    icon: IconDistance,
  },
  {
    id: 103,
    name: 'Организаторы',
    href: '/organizers',
    permission: '',
    icon: IconOrganizers,
  },
];

export const supportEmails: TEmail[] = [
  {
    id: 0,
    name: 'support@bike-caucasus.ru',
    email: 'support@bike-caucasus.ru',
  },
];

export const supportLinks: TLinkWithImage[] = [
  {
    id: 0,
    href: 'https://t.me/Aleksandr_BV',
    name: 'Разработчик',
    src: '/images/icons/telegram.svg',
    alt: 'Telegram',
  },
];

export const socialLinks: TLinkWithImage[] = [
  {
    id: 0,
    href: 'https://t.me/velokmv',
    name: 'Велотренировки на КМВ',
    src: '/images/icons/telegram.svg',
    alt: 'Telegram',
  },
  {
    id: 1,
    href: 'https://t.me/meetupkmv',
    name: 'Объявления о совместных заездах',
    src: '/images/icons/telegram.svg',
    alt: 'Telegram',
  },
];

// навигация по страницам
export const mapNavLinksFull: TMenuPopup[] = [
  { id: 0, name: 'Главная', href: '/', permission: null },
  { id: 1, name: 'Вебкамеры', href: '/webcam', permission: null },
  { id: 2, name: 'Маршруты', href: '/trails', permission: null },
  { id: 3, name: 'Цены на услуги', href: '/price', permission: null },
  ...getNavLinksChampionshipsPopup(),
];

// навигация по страницам
export const navLinksFull = [
  { id: 0, name: 'Главная', href: '/', permission: null },
  { id: 1, name: 'Вебкамеры', href: '/webcam', permission: null },
  { id: 2, name: 'Маршруты', href: '/trails', permission: null },
  {
    id: 4,
    name: 'Чемпионаты',
    href: '/championships',
    permission: null,
    popupMenu: getNavLinksChampionshipsPopup,
  },
  // { id: 4, name: 'Джилы-Су', href: '/dzhilsu', permission: null },
];

// навигация по страницам политике конфиденциальности.
export const legalLinks = [
  {
    id: 0,
    name: 'Политика конфиденциальности',
    href: '/legal/privacy-policy',
    permission: null,
  },
  { id: 1, name: 'Пользовательское соглашение', href: '/legal/terms-of-use', permission: null },
  { id: 2, name: 'Публичная оферта', href: '/legal/offer', permission: null },
];

/**
 * Меню навигации для управления новостью в меню Popup.
 */
export const getNavLinksNewsPopup = ({
  urlSlug,
  client,
}: {
  urlSlug: string;
  client: TClientMeta;
}): TMenuOnPage[] => {
  return [
    {
      id: 0,
      name: 'Редактирование',
      href: `/moderation/news/edit/${urlSlug}`,
      permission: 'moderation.news.edit',
      icon: IconEditOld,
      classes: [],
    },
    {
      id: 1,
      name: 'Удаление',
      onClick: () => deleteItem({ type: 'news', urlSlug, client }),
      permission: 'moderation.news.delete',
      icon: IconDelete,
      classes: [],
    },
  ];
};

/**
 * Меню навигации для управления Маршрутом в меню Popup.
 */
export const getNavLinksTrailPopup = ({
  urlSlug,
  client,
}: {
  urlSlug: string;
  client: TClientMeta;
}): TMenuOnPage[] => [
  {
    id: 0,
    name: 'Редактирование',
    href: `/moderation/trails/edit/${urlSlug}`,
    permission: 'moderation.trails.edit',
    icon: IconEditOld,
    classes: [],
  },
  {
    id: 1,
    name: 'Удаление',
    onClick: () => deleteItem({ type: 'trails', urlSlug, client }),
    permission: 'moderation.trails.delete',
    icon: IconDelete,
    classes: [],
  },
];

/**
 * Меню навигации для управления Чемпионатом в меню Popup.
 */
export const getNavLinksChampionshipPopup = (
  urlSlug: string,
  raceId: string,
  championshipId: string,
  client: TClientMeta,
  hiddenItemNames: string[] = []
): TMenuOnPage[] =>
  [
    {
      id: 0,
      name: 'Редактирование',
      href: `/moderation/championship/edit/${urlSlug}`,
      permission: 'moderation.championship.edit',
      icon: IconEditOld,
      classes: [],
    },
    {
      id: 1,
      name: 'Финишные протоколы',
      href: `/moderation/championship/protocol/${urlSlug}/${raceId}`,
      permission: 'moderation.championship.protocol',
      icon: IconEditOld,
      classes: [],
    },
    {
      id: 2,
      name: 'Удаление',
      onClick: () => deleteItem({ type: 'championship', urlSlug, client }),
      permission: 'moderation.championship.delete',
      icon: IconDelete,
      classes: [],
    },
    {
      id: 3,
      name: 'Обновление данных генеральной классификации',
      onClick: () => upsertItem(championshipId),
      permission: 'moderation.championship',
      icon: IconRefresh,
      classes: [],
    },
  ].filter((item) => !hiddenItemNames.includes(item.name));
