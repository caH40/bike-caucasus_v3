import { DEFAULT_AGE_NAME_CATEGORY } from '@/constants/category';
import type { TOptions } from '@/types/index.interface';
import { TCategories } from '@/types/models.interface';

/**
 * Создание массива option для Select выбора стартового номера.
 */
export const createOptionsStartNumbers = (startNumbers: number[]): TOptions[] => {
  return startNumbers.map((number) => ({
    id: number,
    translation: number.toString(),
    name: number.toString(),
  }));
};

/**
 * Создание массива option для Select выбора названия категории из созданных в чемпионате для выбранного заезда.
 */
export const createCategoryOptions = (
  categories: Omit<TCategories, '_id' | 'championship'> & {
    _id: string;
  },
  gender: 'male' | 'female'
): TOptions[] => {
  // По умолчанию, означает, что выбор возрастной категории будет осуществляться автоматически согласно возрасту.
  const ageCategory = {
    id: 0,
    translation: DEFAULT_AGE_NAME_CATEGORY,
    name: DEFAULT_AGE_NAME_CATEGORY,
  };

  const skillLevelCat = categories.skillLevel?.[gender];

  if (!skillLevelCat) {
    return [ageCategory];
  }

  const options = skillLevelCat.map((cat, index) => ({
    id: index + 1,
    translation: cat.name,
    name: cat.name,
  }));

  return [ageCategory, ...options];
};
