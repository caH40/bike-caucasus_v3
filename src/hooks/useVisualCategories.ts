import { useMemo } from 'react';

// types
import {
  TAgeCategoriesForVisual,
  TAgeCategoryFromForm,
  TGender,
} from '@/types/index.interface';

type Params = {
  maleCategories: TAgeCategoryFromForm[];
  femaleCategories: TAgeCategoryFromForm[];
  ageCategoryGender: TGender;
};

/**
 * Изменение массива возрастных категорий с отображением промежутков (блоков) годов с не назначенными категориями. Подсвечивание наложений границ категорий друг на друга.
 */
export function useVisualCategories({
  maleCategories,
  femaleCategories,
  ageCategoryGender,
}: Params): TAgeCategoriesForVisual[] {
  const visualCategories = useMemo(() => {
    const categories = ageCategoryGender === 'male' ? maleCategories : femaleCategories;

    if (categories.length === 0) {
      return [];
    }

    const sortedCategories = categories.toSorted((a, b) => +a.min - +b.min);

    // 1. Верхнюю границу первого блока сравнить с нижней границе следующего блока. Если равны или второе значение меньше первого, то произошло наложение. Если больше единицы, значит пустой промежуток между категориями.

    const result: TAgeCategoriesForVisual[] = [{ ...sortedCategories[0] }];
    // result.push()

    for (let i = 0; i < sortedCategories.length; i++) {
      const current = sortedCategories[i];
      const next = sortedCategories[i + 1];

      // Если i итерация последняя, то выход из цикла. Нет последующего блока, а значит не с чем сравнивать.
      if (!next) {
        continue;
      }

      if (next.min <= current.max) {
        // Наложение.
        result.push({ ...next, isWrong: true });
      } else if (+next.min - +current.max > 1) {
        // Пустой промежуток. (Дополнительный блок)
        result.push({
          min: +current.max + 1,
          max: +next.min - 1,
          name: 'нет',
          isEmpty: true,
        });

        result.push(next);
      } else {
        // Нет ошибок, добавляется следующий блок.
        result.push(next);
      }
    }

    return result;
  }, [maleCategories, femaleCategories, ageCategoryGender]);

  return visualCategories;
}
