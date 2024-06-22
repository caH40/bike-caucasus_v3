'use client';

import IconAccount from '@/components/Icons/IconAccount';
import IconFinish from '@/components/Icons/IconFinish';
import IconCalendar from '@/components/Icons/IconCreate';
import IconNewspaper from '@/components/Icons/IconNewspaper';
import IconRoute from '@/components/Icons/IconRoute';
import IconTeam from '@/components/Icons/IconTeam';
import IconUser from '@/components/Icons/IconUser';
import IconCreate from '@/components/Icons/IconCreate';
import IconEdit from '@/components/Icons/IconEdit';
import IconView from '@/components/Icons/IconView';
import IconAdd from '@/components/Icons/IconAdd';
import IconUsers from '@/components/Icons/IconUsers';
import IconLog from '@/components/Icons/IconLog';
import type { TMenuOnPage } from '@/types/index.interface';

// Кнопки для меню на странице Модерация новости /moderation/news
export const buttonsMenuModerationNewsPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Создание',
    classes: [],
    href: '/moderation/news/create',
    permission: 'moderation.news.create',
    icon: IconCreate,
  },
  {
    id: 1,
    name: 'Редактирование',
    classes: [],
    href: '/moderation/news/edit',
    permission: 'moderation.news.edit',
    icon: IconEdit,
  },
  {
    id: 2,
    name: 'Список новостей',
    classes: [],
    href: '/moderation/news/list',
    permission: 'moderation.news.list',
    icon: IconView,
  },
];

// Кнопки для меню на странице Модерация маршрута /moderation/trails
export const buttonsMenuModerationTrailsPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Создание',
    classes: [],
    href: '/moderation/trails/create',
    permission: 'moderation.trails.create',
    icon: IconCreate,
  },
  {
    id: 1,
    name: 'Редактирование',
    classes: [],
    href: '/moderation/trails/edit',
    permission: 'moderation.trails.edit',
    icon: IconEdit,
  },
  {
    id: 2,
    name: 'Список новостей',
    classes: [],
    href: '/moderation/trails/list',
    permission: 'moderation.trails.list',
    icon: IconView,
  },
];

// Кнопки для меню на странице Модерация (Главная) /moderation/
export const buttonsMenuModerationPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Новости',
    classes: [],
    href: '/moderation/news/create',
    permission: 'moderation.news.create',
    icon: IconNewspaper,
  },
  {
    id: 1,
    name: 'Маршруты',
    classes: [],
    href: '/moderation/trails',
    permission: 'moderation.trails',
    icon: IconRoute,
  },
  {
    id: 2,
    name: 'Соревнования',
    classes: [],
    href: '/moderation/championship',
    permission: 'moderation.championship',
    icon: IconFinish,
  },
  {
    id: 3,
    name: 'Календарь',
    classes: [],
    href: '/moderation/calendar',
    permission: 'moderation.calendar',
    icon: IconCalendar,
  },
];

// Кнопки для меню на странице Аккаунт Профиль /account/profile
export const buttonsMenuAccountPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Профиль',
    classes: [],
    href: '/account/profile',
    permission: 'authorized', // Для авторизованного пользователя.
    icon: IconUser,
  },
  {
    id: 1,
    name: 'Команда',
    classes: [],
    href: '/account/team',
    permission: 'authorized', // Для авторизованного пользователя.
    icon: IconTeam,
  },
  {
    id: 2,
    name: 'Аккаунт',
    classes: [],
    href: '/account/details',
    permission: 'authorized', // Для авторизованного пользователя.
    icon: IconAccount,
  },
];

// Кнопки для меню на странице Админ /admin/
export const buttonsMenuAdminPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Пользователи',
    classes: [],
    href: '/admin/users',
    permission: 'admin', // Для администратора сайта.
    icon: IconUsers,
  },
  {
    id: 1,
    name: 'Логи модераторов',
    classes: [],
    href: '/admin/logs/admin',
    permission: 'admin', // Для администратора сайта.
    icon: IconLog,
  },
  {
    id: 2,
    name: 'Логи ошибок',
    classes: [],
    href: '/admin/logs/errors',
    permission: 'admin', // Для администратора сайта.
    icon: IconLog,
  },
];

// Кнопки для меню на странице Модерация календаря /moderation/calendar
export const buttonsMenuModerationCalendarPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Добавление события',
    classes: [],
    href: '/moderation/calendar/create',
    permission: 'moderation.calendar.create',
    icon: IconAdd,
  },
  {
    id: 1,
    name: 'Редактирование',
    classes: [],
    href: '/moderation/calendar/edit',
    permission: 'moderation.calendar.edit',
    icon: IconEdit,
  },
  {
    id: 2,
    name: 'Список событий',
    classes: [],
    href: '/moderation/calendar/list',
    permission: 'moderation.calendar.list',
    icon: IconView,
  },
];
