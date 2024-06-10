import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// Определение типа Props для параметров функции
type Props = {
  bikeType: string;
  region: string;
  difficultyLevel: string;
};

/**
 * Хук для определения активных фильтров для маршрутов.
 * @param {Object} props - Свойства компонента.
 * @param props.bikeType - Тип велосипеда.
 * @param props.region - Регион.
 * @param props.difficultyLevel - Уровень сложности.
 * @returns Объект, содержащий состояние фильтров и функцию для его обновления.
 * @returns returns.hasFilters - Указывает, активны ли фильтры.
 * @returns returns.setHasFilters - Функция для обновления состояния фильтров.
 */
export function useActiveFiltersTrails({ bikeType, region, difficultyLevel }: Props): {
  hasFilters: boolean;
  setHasFilters: Dispatch<SetStateAction<boolean>>;
} {
  const [hasFilters, setHasFilters] = useState<boolean>(false);

  useEffect(() => {
    if (
      (bikeType !== '' && bikeType !== 'нет фильтров') ||
      (region !== '' && region !== 'нет фильтров') ||
      (difficultyLevel !== '' && difficultyLevel !== 'нет фильтров')
    ) {
      setHasFilters(true);
    } else {
      setHasFilters(false);
    }
  }, [bikeType, region, difficultyLevel]);

  return { hasFilters, setHasFilters };
}
