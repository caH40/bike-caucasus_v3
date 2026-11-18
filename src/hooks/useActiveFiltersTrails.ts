type Props = {
  bikeType: string;
  region: string;
  difficultyLevel: string;
  search: string;
};

const NO_FILTER = 'нет фильтров';

/**
 * Хук для определения активных фильтров для маршрутов.
 * @param {Object} props - Свойства компонента.
 * @param props.bikeType - Тип велосипеда.
 * @param props.region - Регион.
 * @param props.difficultyLevel - Уровень сложности.
 * @returns hasFilters - Указывает, активны ли фильтры.
 */
export function useActiveFiltersTrails({
  bikeType,
  region,
  difficultyLevel,
  search,
}: Props): boolean {
  return (
    (bikeType !== '' && bikeType !== NO_FILTER) ||
    (region !== '' && region !== NO_FILTER) ||
    (difficultyLevel !== '' && difficultyLevel !== NO_FILTER) ||
    search !== ''
  );
}
