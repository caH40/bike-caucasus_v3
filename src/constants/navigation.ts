import IconAdmin from '@/components/Icons/IconAdmin';
import IconCalendar from '@/components/Icons/IconCalendar';
import IconChampionship from '@/components/Icons/IconChampionship';
import IconDelete from '@/components/Icons/IconDelete';
import IconEditOld from '@/components/Icons/IconEditOld';
import IconOrganizers from '@/components/Icons/IconOrganizers';
import IconUser from '@/components/Icons/IconUser';
import IconWrench from '@/components/Icons/IconWrench';
import { deleteItem } from '@/components/UI/BlockModeration/delete';
import type { TMenuOnPage, TMenuPopup } from '@/types/index.interface';

/**
 * Главное меню навигации сайта в мобильной версии.
 */
export const getNavLinksMobile = (userId: string | undefined) => [
  { id: 0, name: 'Главная', href: '/', permission: null },
  { id: 1, name: 'Вебкамеры', href: '/webcam', permission: null },
  { id: 2, name: 'Маршруты', href: '/trails', permission: null },
  { id: 3, name: 'Календарь', href: '/calendar', permission: null },
  { id: 4, name: 'Чемпионаты', href: '/championships', permission: null },
  {
    id: 5,
    name: 'Профиль',
    href: userId ? `/profile/${userId}` : '/',
    permission: 'authorized',
    icon: IconUser,
  },
  { id: 6, name: 'Организаторы', href: '/organizers', permission: null },
  { id: 7, name: 'Управление', href: '/moderation', permission: 'moderation' },
  { id: 8, name: 'Админ', href: '/admin', permission: 'admin' },
];

/**
 * Меню навигации у Пользователя в Popup.
 */
export const getNavLinksUserPopup = (userId: string | undefined): TMenuPopup[] => [
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
 * Меню навигации у Чемпионатов в Popup.
 */
export const getNavLinksChampionshipsPopup = (): TMenuPopup[] => [
  {
    id: 0,
    name: 'Чемпионаты',
    href: '/championships',
    permission: '',
    icon: IconChampionship,
  },
  {
    id: 1,
    name: 'Календарь',
    href: '/calendar',
    permission: '',
    icon: IconCalendar,
  },
  {
    id: 2,
    name: 'Организаторы',
    href: '/organizers',
    permission: '',
    icon: IconOrganizers,
  },
];

// навигация по страницам
export const navLinksFull = [
  { id: 0, name: 'Главная', href: '/', permission: null },
  { id: 1, name: 'Вебкамеры', href: '/webcam', permission: null },
  { id: 2, name: 'Маршруты', href: '/trails', permission: null },
  // { id: 3, name: 'Календарь', href: '/calendar', permission: null },
  {
    id: 4,
    name: 'Чемпионаты',
    href: '/championships',
    permission: null,
    popupMenu: getNavLinksChampionshipsPopup,
  },
  // { id: 3, name: 'Галерея', href: '/gallery', permission: null },
  // { id: 4, name: 'Джилы-Су', href: '/dzhilsu', permission: null },
];

/**
 * Меню навигации для управления новостью в меню Popup.
 */
export const getNavLinksNewsPopup = (urlSlug: string): TMenuOnPage[] => [
  {
    id: 0,
    name: 'Редактирование',
    href: `/moderation/news/edit/${urlSlug}`,
    permission: 'admin',
    icon: IconEditOld,
    classes: [],
  },
  {
    id: 1,
    name: 'Удаление',
    onClick: () => deleteItem({ type: 'news', urlSlug }),
    permission: 'admin',
    icon: IconDelete,
    classes: [],
  },
];

/**
 * Меню навигации для управления Маршрутом в меню Popup.
 */
export const getNavLinksTrailPopup = (urlSlug: string): TMenuOnPage[] => [
  {
    id: 0,
    name: 'Редактирование',
    href: `/moderation/trails/edit/${urlSlug}`,
    permission: 'admin',
    icon: IconEditOld,
    classes: [],
  },
  {
    id: 1,
    name: 'Удаление',
    onClick: () => deleteItem({ type: 'trails', urlSlug }),
    permission: 'admin',
    icon: IconDelete,
    classes: [],
  },
];
