import { useMemo } from 'react';

// types
import {
  TAgeCategoriesForVisual,
  TAgeCategoryFromForm,
  TGender,
} from '@/types/index.interface';
import { validateAndVisualizeCategories } from '@/libs/utils/validateAndVisualizeCategories';

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
}: Params): {
  visualCategories: TAgeCategoriesForVisual[];
  hasOverlappingCategory: boolean;
  hasEmptyCategory: boolean;
} {
  return useMemo(() => {
    return validateAndVisualizeCategories({
      maleCategories,
      femaleCategories,
      ageCategoryGender,
    });
  }, [maleCategories, femaleCategories, ageCategoryGender]);
}
