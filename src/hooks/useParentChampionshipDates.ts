import { getDateTime } from '@/libs/utils/calendar';
import { useMemo } from 'react';

/**
 * Хук для получения дат родительского чемпионата.
 * Возвращает даты начала и конца, если тип чемпионата равен 'stage'.
 * Если тип отличается от 'stage', возвращает undefined.
 *
 * @param parentChampionships Массив всех чемпионатов.
 * @param parentId Идентификатор родительского чемпионата.
 * @param type Тип текущего чемпионата.
 * @returns Объект с датами или undefined.
 */
function useParentChampionshipDates(
  parentChampionships: Array<{ _id: string; startDate: string; endDate: string }>, // Массив чемпионатов
  parentId: string, // Идентификатор родительского чемпионата
  type: string // Тип чемпионата ('stage' или другие значения)
): { startDate: string | undefined; endDate: string | undefined } | undefined {
  return useMemo(() => {
    if (type !== 'stage') {
      // Если тип не 'stage', возвращаем undefined для дат
      return {
        startDate: undefined,
        endDate: undefined,
      };
    }

    if (!parentId) {
      return undefined;
    }

    const p = parentChampionships.find((elm) => elm._id === parentId);
    if (p) {
      return {
        startDate: getDateTime(new Date(p.startDate)).isoDate,
        endDate: getDateTime(new Date(p.endDate)).isoDate,
      };
    } else {
      return undefined;
    }
  }, [parentChampionships, parentId, type]);
}

export default useParentChampionshipDates;
