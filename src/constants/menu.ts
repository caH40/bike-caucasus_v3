import { TMenuOnPage } from '@/types/index.interface';

// Кнопки для меню на странице Модерация новости /moderation/news
export const buttonsMenuModerationNewsPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Создание',
    classes: [],
    href: '/moderation/news/create',
  },
  {
    id: 1,
    name: 'Редактирование',
    classes: [],
    href: '/moderation/news/edit',
  },
  {
    id: 2,
    name: 'Список всех новостей',
    classes: [],
    href: '/moderation/news/list',
  },
];

// Кнопки для меню на странице Модерация новости /moderation/news
export const buttonsMenuModerationPage: TMenuOnPage[] = [
  {
    id: 0,
    name: 'Новости',
    classes: [],
    href: '/moderation/news/create',
  },
  {
    id: 1,
    name: 'Маршруты',
    classes: [],
    href: '/moderation/routes/create',
  },
  {
    id: 2,
    name: 'Соревнования',
    classes: [],
    href: '/moderation/championship',
  },
];