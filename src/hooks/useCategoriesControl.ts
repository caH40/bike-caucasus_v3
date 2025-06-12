import { Control, useWatch } from 'react-hook-form';

// types
import { TFormChampionshipCategories, TGender } from '@/types/index.interface';

type Params = {
  control: Control<TFormChampionshipCategories>;
  categoriesIndex: number;
  ageCategoryGender: TGender;
};

/**
 * Формирование массива возрастных категорий для визуализации в виде последовательности блоков с возрастными границами категорий.
 */
export function useCategoriesControl({ categoriesIndex, control }: Params) {
  const maleCategories = useWatch({
    control,
    name: `categories.${categoriesIndex}.age.male`,
  });

  const femaleCategories = useWatch({
    control,
    name: `categories.${categoriesIndex}.age.female`,
  });

  return { maleCategories, femaleCategories };
}
