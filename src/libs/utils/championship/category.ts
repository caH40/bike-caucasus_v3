import { sortCategoriesString } from './championship';

// types
import { TCategoriesConfigNames, TCategoriesConfigsForm } from '@/types/index.interface';

export type CategoriesInResult = {
  categoryAge: string;
  categorySkillLevel: string | null;
};

/**
 * Название всех возрастных категорий ГК в которых есть результаты.
 */
export function getExistCategoryNames<T extends CategoriesInResult>(
  results: T[]
): TCategoriesConfigNames {
  const ageCategoriesSet = new Set<string>();
  const skillLevelCategoriesSet = new Set<string>();

  for (const result of results) {
    // Если  есть skillLevel категория, то результат участвует только в skillLevel категоризации.
    if (result.categorySkillLevel) {
      skillLevelCategoriesSet.add(result.categorySkillLevel);
    } else {
      ageCategoriesSet.add(result.categoryAge);
    }
  }

  // Сортируем категории по возрастанию года рождения.
  const ageCategoriesSorted = sortCategoriesString([...ageCategoriesSet]);

  return { age: [...ageCategoriesSorted], skillLevel: [...skillLevelCategoriesSet] };
}

import { TBoxPosition } from '@/types/index.interface';
import { validateAndVisualizeCategories } from '../validateAndVisualizeCategories';

/**
 * Определяет позицию блока (прямоугольника) возрастной категории
 * в горизонтальной шкале на основе общего количества блоков и текущего индекса.
 *
 * Используется для применения визуальных стилей (например, скругления углов)
 * в зависимости от положения блока в ряду.
 *
 * @param totalBoxes - Общее количество блоков в шкале
 * @param currentIndex - Порядковый номер текущего блока (начиная с 1)
 * @returns Позиция блока: 'solo' — единственный, 'left' — левый край, 'right' — правый край, 'center' — внутри ряда
 */
export function getAgeCategoryBoxPosition(
  totalBoxes: number,
  currentIndex: number
): TBoxPosition {
  if (totalBoxes <= 1) {
    return 'solo';
  } else if (totalBoxes === 2) {
    return currentIndex === 1 ? 'left' : 'right';
  }

  if (currentIndex === 1) {
    return 'left';
  } else if (currentIndex === totalBoxes) {
    return 'right';
  } else {
    return 'center';
  }
}

/**
 * Возвращает цвет для возрастной категории в зависимости от позиции.
 */
export function getAgeCategoryColor(index: number): string {
  const palette = [
    '#6BAED6', // светло-синий.
    '#74C476', // зелёный.
    '#FD8D3C', // оранжевый.
    '#9E9AC8', // фиолетовый.
    '#F768A1', // розовый.
    '#FDD835', // жёлтый.
    '#A1887F', // коричневый.
    '#4DB6AC', // бирюзовый.
  ];

  return palette[index % palette.length];
}

/**
 * Проверка всех конфигураций категорий перед отправкой на сервер для обновления.
 * Проверяется на пропуски в годах между категориями и на наложение диапазонов возрастных категорий друг на друга.
 */
export function validateCategoriesBeforePost(categories: TCategoriesConfigsForm[]) {
  return categories.reduce(
    (acc, cur) => {
      const maleCategory = validateAndVisualizeCategories({
        maleCategories: cur.age.male,
        femaleCategories: cur.age.female, // неважно, можно [] — игнорируется
        ageCategoryGender: 'male',
      });

      acc.hasEmptyCategory = acc.hasEmptyCategory || maleCategory.hasEmptyCategory;
      acc.hasOverlappingCategory =
        acc.hasOverlappingCategory || maleCategory.hasOverlappingCategory;

      const femaleCategory = validateAndVisualizeCategories({
        maleCategories: cur.age.male, // неважно, можно []
        femaleCategories: cur.age.female,
        ageCategoryGender: 'female',
      });

      acc.hasEmptyCategory = acc.hasEmptyCategory || femaleCategory.hasEmptyCategory;
      acc.hasOverlappingCategory =
        acc.hasOverlappingCategory || femaleCategory.hasOverlappingCategory;

      return acc;
    },
    { hasEmptyCategory: false, hasOverlappingCategory: false }
  );
}
