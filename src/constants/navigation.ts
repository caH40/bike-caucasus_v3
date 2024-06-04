import IconAdmin from '@/components/Icons/IconAdmin';
import IconUser from '@/components/Icons/IconUser';
import IconWrench from '@/components/Icons/IconWrench';

// навигация по страницам
export const navLinksFull = [
  { id: 0, name: 'Главная', href: '/', permission: null },
  { id: 1, name: 'Вебкамеры', href: '/webcam', permission: null },
  { id: 2, name: 'Маршруты', href: '/trails', permission: null },
  // { id: 3, name: 'Галерея', href: '/gallery', permission: null },
  // { id: 4, name: 'Джилы-Су', href: '/dzhilsu', permission: null },
];

/**
 * Главное меню навигации сайта в мобильной версии.
 */
export const getNavLinksMobile = (userId: string | undefined) => [
  { id: 0, name: 'Главная', href: '/', permission: null },
  { id: 1, name: 'Вебкамеры', href: '/webcam', permission: null },
  { id: 2, name: 'Маршруты', href: '/trails', permission: null },
  {
    id: 3,
    name: 'Профиль',
    href: userId ? `/profile/${userId}` : '/',
    permission: 'authorized',
    icon: IconUser,
  },
  { id: 4, name: 'Управление', href: '/moderation', permission: 'moderation' },
  { id: 6, name: 'Админ', href: '/admin', permission: 'admin' },
];

/**
 * Меню навигации у Пользователя в Popup.
 */
export const getNavLinksUserPopup = (userId: string | undefined) => [
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
