import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { lcSuffixTrailsFilters as suffix } from '@/constants/local-storage';

type PropsInit = {
  setRegion: Dispatch<SetStateAction<string>>;
  setDifficultyLevel: Dispatch<SetStateAction<string>>;
  setBikeType: Dispatch<SetStateAction<string>>;
  setSortDirection: Dispatch<SetStateAction<string>>;
  setSortTarget: Dispatch<SetStateAction<string>>;
};

/**
 * Хук инициализирует фильтры для отображения Маршрутов, данные в фильтры берутся из LocalStorage.
 */
export function useLSTrailsInit({
  setRegion,
  setDifficultyLevel,
  setBikeType,
  setSortDirection,
  setSortTarget,
}: PropsInit): void {
  useEffect(() => {
    const initRegion = localStorage.getItem(`${suffix}region`) || '';
    const initDifficultyLevel = localStorage.getItem(`${suffix}difficultyLevel`) || '';
    const initBikeType = localStorage.getItem(`${suffix}bikeType`) || '';
    const initSortDirection = localStorage.getItem(`${suffix}sortDirection`) || 'up';
    const initSortTarget = localStorage.getItem(`${suffix}sortTarget`) || 'distance';

    setRegion(initRegion);
    setDifficultyLevel(initDifficultyLevel);
    setBikeType(initBikeType);
    setSortDirection(initSortDirection);
    setSortTarget(initSortTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
