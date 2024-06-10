import { useEffect } from 'react';

import { adBlockRecommendation } from '../yandex/ad-blocks';

const isDevelopment = process.env.NODE_ENV === 'development';
/**
 * Хук для рекомендательного виджета
 * @param {number[]} numbers номера блоков присвоенных РСЯ (../yandex/blocks)
 */
export const useAd = (numbers: number[]) => {
  useEffect(() => {
    if (isDevelopment) {
      return;
    }

    for (const number of numbers) {
      adBlockRecommendation(number);
    }
  }, [numbers]);
};
