import { useEffect } from 'react';

import { lcSuffixTrailsFilters as suffix } from '@/constants/local-storage';

type Props = {
  region: string;
  difficultyLevel: string;
  bikeType: string;
  sortDirection: string;
  sortTarget: string;
};

/**
 * Хук сохраняет Фильтры для отображения Маршрутов.
 */
export function useLSTrails({
  region,
  difficultyLevel,
  bikeType,
  sortDirection,
  sortTarget,
}: Props) {
  // // Сохранение региона (region).
  useSaveToLC('region', region);

  // // Сохранение уровня сложности (difficultyLevel).
  useSaveToLC('difficultyLevel', difficultyLevel);

  // Сохранение Типа велосипеда (bikeType).
  useSaveToLC('bikeType', bikeType);

  // Сохранение Типа велосипеда (bikeType).
  useSaveToLC('sortDirection', sortDirection);

  // Сохранение Типа велосипеда (bikeType).
  useSaveToLC('sortTarget', sortTarget);
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
