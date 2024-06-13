import { TMenuOnPage } from '@/types/index.interface';
// import IconUsers from '@/components/Icons/IconUsers';
// import IconCreator from '@/components/Icons/IconCreator';
// import IconLog from '@/components/Icons/IconLog';

// Кнопки для меню на странице Модерация новости /moderation/news
export const buttonsMenuModerationNewsPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Создание',
    classes: [],
    href: '/moderation/news/create',
    permission: 'moderation.news.create',
  },
  {
    id: 1,
    name: 'Редактирование',
    classes: [],
    href: '/moderation/news/edit',
    permission: 'moderation.news.edit',
  },
  {
    id: 2,
    name: 'Список новостей',
    classes: [],
    href: '/moderation/news/list',
    permission: 'moderation.news.list',
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
  },
  {
    id: 1,
    name: 'Редактирование',
    classes: [],
    href: '/moderation/trails/edit',
    permission: 'moderation.trails.edit',
  },
  {
    id: 2,
    name: 'Список новостей',
    classes: [],
    href: '/moderation/trails/list',
    permission: 'moderation.trails.list',
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
  },
  {
    id: 1,
    name: 'Маршруты',
    classes: [],
    href: '/moderation/trails',
    permission: 'moderation.trails',
  },
  {
    id: 2,
    name: 'Соревнования',
    classes: [],
    href: '/moderation/championship',
    permission: 'moderation.championship',
  },
  {
    id: 3,
    name: 'Календарь',
    classes: [],
    href: '/moderation/calendar',
    permission: 'moderation.calendar',
  },
];

// Кнопки для меню на странице Аккаунт новости /account/
export const buttonsMenuAccountPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Профиль',
    classes: [],
    href: '/account/profile',
    permission: 'authorized', // Для авторизованного пользователя.
  },
  {
    id: 1,
    name: 'Команда',
    classes: [],
    href: '/account/team',
    permission: 'authorized', // Для авторизованного пользователя.
  },
  {
    id: 2,
    name: 'Аккаунт',
    classes: [],
    href: '/account/details',
    permission: 'authorized', // Для авторизованного пользователя.
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
    // icon: IconUsers,
  },
  {
    id: 1,
    name: 'Логи модераторов',
    classes: [],
    href: '/admin/logs/admin',
    permission: 'admin', // Для администратора сайта.
    // icon: IconCreator,
  },
  {
    id: 2,
    name: 'Логи ошибок',
    classes: [],
    href: '/admin/logs/errors',
    permission: 'admin', // Для администратора сайта.
    // icon: IconLog,
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
  },
  {
    id: 1,
    name: 'Редактирование',
    classes: [],
    href: '/moderation/calendar/edit',
    permission: 'moderation.calendar.edit',
  },
  {
    id: 2,
    name: 'Список событий',
    classes: [],
    href: '/moderation/calendar/list',
    permission: 'moderation.calendar.list',
  },
];
