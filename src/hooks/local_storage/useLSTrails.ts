import { useEffect } from 'react';

import { lcSuffixTrailsFilters as suffix } from '@/constants/local-storage';

type Props = {
  region: string;
  difficultyLevel?: string;
  bikeType: string;
};

/**
 * Хук сохраняет Фильтры для отображения Маршрутов.
 */
export function useLSTrails({ region, difficultyLevel, bikeType }: Props) {
  // // Сохранение региона (region).
  useSaveToLC('region', region);

  // // Сохранение уровня сложности (difficultyLevel).
  // useSaveToLC('difficultyLevel', difficultyLevel);

  // Сохранение Типа велосипеда (bikeType).
  useSaveToLC('bikeType', bikeType);
}

/**
 *Сохраняет простые данные String или Number в Локальное хранилище.
 */
function useSaveToLC(property: string, value: string | number) {
  useEffect(() => {
    if (!value) {
      return;
    }

    localStorage.setItem(`${suffix}${property}`, String(value));
  }, [value, property]);
}
