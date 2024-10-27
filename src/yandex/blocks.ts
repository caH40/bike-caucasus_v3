type AdsBlock = {
  id: number;
  label: string;
  description: string;
  type?: string;
};

/**
 * Объект рекламных блоков, созданных в РСЯ
 */
export const adBlocks: AdsBlock[] = [
  {
    id: 5,
    label: 'R-A-5213436-5',
    description: 'Баннер, webcam page',
  },
  {
    id: 6,
    label: 'R-A-5213436-6',
    description: 'Баннер, trails page',
  },
  {
    id: 7,
    label: 'R-A-5213436-7',
    description: 'Баннер, newsOne page',
  },
  {
    id: 8,
    label: 'R-A-5213436-8',
    description: 'Баннер, Home page',
  },
  {
    id: 9,
    label: 'R-A-5213436-9',
    description: 'Лента, Календарь',
    type: 'feed',
  },
  {
    id: 10,
    label: 'R-A-5213436-10',
    description: 'Баннер, calendar page',
  },
  {
    id: 13,
    label: 'R-A-5213436-13',
    description: 'Баннер, Home page for mobile',
  },
  {
    id: 14,
    label: 'R-A-5213436-14',
    description: 'Баннер, trails page for mobile',
  },
  {
    id: 11,
    label: 'C-A-5213436-11',
    description: 'RTB1, Домашняя страница',
    type: 'widget',
  },
  {
    id: 12,
    label: 'C-A-5213436-12',
    description: 'RTB2, Вебкамеры',
    type: 'widget',
  },
  {
    id: 16,
    label: 'C-A-5213436-16',
    description: 'RTB3, Маршруты',
    type: 'widget',
  },
  {
    id: 17,
    label: 'C-A-5213436-17',
    description: 'RTB4, Чемпионаты',
    type: 'widget',
  },
  {
    id: 18,
    label: 'C-A-5213436-18',
    description: 'RTB4, Организаторы, Календарь',
    type: 'widget',
  },
];
