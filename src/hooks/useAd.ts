import { useEffect } from 'react';

import { adBlockRecommendation } from '../yandex/ad-blocks';

const isDevelopment = process.env.NODE_ENV === 'development';
/**
 * Хук для рекомендательного виджета
 * @param {number} number номера блоков присвоенных РСЯ (../yandex/blocks)
 */
export const useAd = (number: number): void => {
  useEffect(() => {
    if (isDevelopment) {
      return;
    }
    adBlockRecommendation(number);
  }, [number]);
};
