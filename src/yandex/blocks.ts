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
    description: 'RTB, Домашняя страница',
    type: 'widget',
  },
];
// <!-- Yandex.RTB C-A-5213436-11 -->
// <div id="yandex_rtb_C-A-5213436-11"></div>
// <script>window.yaContextCb.push(()=>{
//   Ya.Context.AdvManager.renderWidget({
//     renderTo: 'yandex_rtb_C-A-5213436-11',
//     blockId: 'C-A-5213436-11'
//   })
// })</script>

// <!-- Yandex.RTB R-A-5213436-10 -->
// <div id="yandex_rtb_R-A-5213436-10"></div>
// <script>
// window.yaContextCb.push(() => {
//     Ya.Context.AdvManager.render({
//         "blockId": "R-A-5213436-10",
//         "renderTo": "yandex_rtb_R-A-5213436-10"
//     })
// })
// </script>

// {
//   id: 16,
//   label: 'C-A-5165832-16',
//   description: 'РВ, Main',
//   type: 'widget',
// },
