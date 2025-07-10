'use client';

import IconAccount from '@/components/Icons/IconAccount';
import IconCalendar from '@/components/Icons/IconCalendar';
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
import IconRole from '@/components/Icons/IconRole';
import IconChampionship from '@/components/Icons/IconChampionship';
import IconOrganizers from '@/components/Icons/IconOrganizers';
import IconResults from '@/components/Icons/IconResults';

import type { TMenuOnPage } from '@/types/index.interface';
import IconDistance from '@/components/Icons/IconDistance';
import IconBriefcase from '@/components/Icons/IconBriefcase';
import IconTransactionHistory from '@/components/Icons/IconTransactionHistory';
import { IconSiteServices, IconTickets } from '@/components/Icons';

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
    name: 'Список маршрутов',
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
    permission: 'moderation.news',
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
    name: 'Календарь',
    classes: [],
    href: '/moderation/calendar',
    permission: 'moderation.calendar',
    icon: IconCalendar,
  },
  {
    id: 3,
    name: 'Чемпионат',
    classes: [],
    href: '/moderation/championship',
    permission: 'moderation.championship',
    icon: IconChampionship,
  },
  {
    id: 4,
    name: 'Организатор',
    classes: [],
    href: '/moderation/organizer',
    permission: 'moderation.organizer',
    icon: IconOrganizers,
  },
  {
    id: 5,
    name: 'Дистанция',
    classes: [],
    href: '/moderation/distances',
    permission: 'moderation.distances',
    icon: IconDistance,
  },
];

// Кнопки для меню на странице Аккаунт Профиль /account/profile
export const buttonsMenuAccountPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Профиль',
    classes: [],
    href: '/account/profile',
    permission: 'authorized',
    icon: IconUser,
  },

  {
    id: 1,
    name: 'Аккаунт',
    classes: [],
    href: '/account/details',
    permission: 'authorized',
    icon: IconAccount,
  },
  {
    id: 3,
    name: 'Финансы и сервисы',
    classes: [],
    href: '/account/services-and-finances',
    permission: 'authorized',
    icon: IconBriefcase,
  },
  {
    id: 4,
    name: 'Команда',
    classes: [],
    href: '/account/team',
    permission: 'authorized',
    icon: IconTeam,
  },
];

// Кнопки для меню на странице Аккаунт Профиль /account/services-and-finances
export const buttonsMenuServicesAndFinancesPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Слоты на соревнования',
    classes: [],
    href: '/account/services-and-finances/competition-slots',
    permission: 'authorized',
    icon: IconTickets,
  },
  {
    id: 1,
    name: 'Платные сервисы',
    classes: [],
    href: '/account/services-and-finances/site-services',
    permission: 'authorized',
    icon: IconSiteServices,
  },
  {
    id: 2,
    name: 'История платежей',
    classes: [],
    href: '/account/services-and-finances/transaction-history',
    permission: 'authorized',
    icon: IconTransactionHistory,
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
    name: 'Роли и разрешения',
    classes: [],
    href: '/admin/access-management/roles/create',
    permission: 'admin', // Для администратора сайта.
    icon: IconRole,
  },
  {
    id: 2,
    name: 'Логи модераторов',
    classes: [],
    href: '/admin/logs/moderators',
    permission: 'admin', // Для администратора сайта.
    icon: IconLog,
  },
  {
    id: 3,
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

// Кнопки для меню на странице Модерация маршрута /moderation/trails
export const buttonsMenuAdminRolesPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Создание Роли',
    classes: [],
    href: '/admin/access-management/roles/create',
    permission: 'admin',
    icon: IconCreate,
  },
  {
    id: 1,
    name: 'Редактирование Роли',
    classes: [],
    href: '/admin/access-management/roles/edit',
    permission: 'admin',
    icon: IconCreate,
  },
  {
    id: 2,
    name: 'Создание Разрешения',
    classes: [],
    href: '/admin/access-management/permissions/create',
    permission: 'admin',
    icon: IconEdit,
  },
  {
    id: 3,
    name: 'Редактирование Разреш.',
    classes: [],
    href: '/admin/access-management/permissions/edit',
    permission: 'admin',
    icon: IconEdit,
  },
];

// Кнопки для меню на странице Модерация маршрута /moderation/organizer
export const buttonsMenuModerationOrganizerPage: TMenuOnPage[] = [
  {
    id: 2,
    name: 'Редактирование',
    classes: [],
    href: '/moderation/organizer/edit',
    permission: 'moderation.organizer',
    icon: IconEdit,
  },
  {
    id: 1,
    name: 'Создание/удаление',
    classes: [],
    href: '/moderation/organizer/create',
    permission: 'moderation.organizer',
    icon: IconCreate,
  },
];

// Кнопки для меню на странице Модерация Чемпионата /moderation/championship
export const buttonsMenuModerationChampionshipPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Создание',
    classes: [],
    href: '/moderation/championship/create',
    permission: 'moderation.championship.create',
    icon: IconAdd,
  },
  {
    id: 1,
    name: 'Редактирование',
    classes: [],
    href: '/moderation/championship/edit',
    permission: 'moderation.championship.edit',
    icon: IconEdit,
  },
  {
    id: 2,
    name: 'Список',
    classes: [],
    href: '/moderation/championship/list',
    permission: 'moderation.championship.list',
    icon: IconView,
  },
  {
    id: 3,
    name: 'Финишный протокол',
    classes: [],
    href: '/moderation/championship/protocol',
    permission: 'moderation.championship.protocol',
    icon: IconResults,
  },
  {
    id: 4,
    name: 'Таблицы очков',
    classes: [],
    href: '/moderation/championship/race-points-tables',
    permission: 'moderation.championship',
    icon: IconChampionship,
  },
];

// Кнопки для меню на странице Дистанция /moderation/distances
export const buttonsMenuModerationDistancesPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Создание',
    classes: [],
    href: '/moderation/distances/create',
    permission: 'moderation.distances.create',
    icon: IconAdd,
  },
  // {
  //   id: 1,
  //   name: 'Редактирование',
  //   classes: [],
  //   href: '/moderation/distances/edit',
  //   permission: 'moderation.distances.edit',
  //   icon: IconEdit,
  // },
  {
    id: 2,
    name: 'Список',
    classes: [],
    href: '/moderation/distances/list',
    permission: 'moderation.distances.list',
    icon: IconView,
  },
];
