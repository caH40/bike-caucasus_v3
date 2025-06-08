import { sortCategoriesString } from './championship';

// types
import { TCategoriesConfigNames } from '@/types/index.interface';

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
