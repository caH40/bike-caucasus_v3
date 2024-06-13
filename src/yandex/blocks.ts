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
  // {
  //   id: 1,
  //   label: 'R-A-5165832-1',
  //   description: 'Floor Ad, Desktop',
  // },
  // {
  //   id: 2,
  //   label: 'R-A-5165832-2',
  //   description: 'Floor Ad, Mobile',
  // },
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
    id: 8,
    label: 'R-A-5213436-9',
    description: 'Лента, Календарь',
    type: 'feed',
  },
];
// {
//   id: 16,
//   label: 'C-A-5165832-16',
//   description: 'РВ, Main',
//   type: 'widget',
// },
