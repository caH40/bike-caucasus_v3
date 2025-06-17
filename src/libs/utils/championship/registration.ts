import { DEFAULT_AGE_NAME_CATEGORY } from '@/constants/category';
import type { TOptions } from '@/types/index.interface';
import { TCategories } from '@/types/models.interface';

/**
 * Создание массива option для Select выбора стартового номера.
 */
export const createStartNumbersOptions = (startNumbers: number[]): TOptions[] => {
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

/**
 * Добавление option с номером зарегистрированного участника в массив options свободных стартовых номеров. Необходимо для отображение данного номера в поле select.
 */
export function addStartNumberOption(
  options: TOptions[],
  startNumberForAdd: number | string
): TOptions[] {
  // Исключение повторного добавления стартового номера зарегистрированного участника.
  if (options.find((p) => p.id === +startNumberForAdd)) {
    return options;
  }

  return [
    ...options,
    {
      id: +startNumberForAdd,
      translation: startNumberForAdd.toString(),
      name: startNumberForAdd.toString(),
    },
  ].sort((a, b) => a.id - b.id);
}
