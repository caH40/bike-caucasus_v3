import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { lcSuffixTrailsFilters as suffix } from '@/constants/local-storage';

type PropsInit = {
  setRegion: Dispatch<SetStateAction<string>>;
  // setDifficultyLevel: Dispatch<SetStateAction<string>>;
  setBikeType: Dispatch<SetStateAction<string>>;
};

/**
 * Хук инициализирует фильтры для отображения Маршрутов, данные в фильтры берутся из LocalStorage.
 */
export function useLSTrailsInit({
  setRegion,
  // setDifficultyLevel,
  setBikeType,
}: PropsInit): void {
  useEffect(() => {
    const initRegion = localStorage.getItem(`${suffix}region`) || '';
    // const initDifficultyLevel = localStorage.getItem(`${suffix}$-difficultyLevel`) || 'easy';
    const initBikeType = localStorage.getItem(`${suffix}bikeType`) || '';

    setRegion(initRegion);
    // setDifficultyLevel(initDifficultyLevel);
    setBikeType(initBikeType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
