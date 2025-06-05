import { TGeneralClassificationResults } from '@/types/index.interface';
import { getCurrentCategoryName, getSpecialCatName } from './results';

export function createCategoriesInRace(
  generalClassification: TGeneralClassificationResults[]
): Map<string, number> {
  // Инициализация коллекции мест по категориям.
  const categoriesInRace = new Map<string, number>([
    ['absolute', 1],
    ['absoluteMale', 1],
    ['absoluteFemale', 1],
  ]);

  // Определение и установка название categoryAge, categorySkillLevelName в счетчики позиций.
  for (const gc of generalClassification) {
    categoriesInRace.set(gc.categoryAge, 1);

    // Добавление названий спецкатегорий в коллекцию счетчиков.
    if (gc.categorySkillLevel) {
      const categorySkillLevelName = getSpecialCatName(
        gc.profile.gender,
        gc.categorySkillLevel
      );
      categoriesInRace.set(categorySkillLevelName, 1);
    }
  }

  return categoriesInRace;
}

/**
 * Установка позиций в генеральнойклассификации
 */
export function setGCPositions(
  gc: TGeneralClassificationResults,
  categoriesInRace: Map<string, number>
): void {
  const isFemale = gc.profile.gender === 'female';

  // Название категории для текущего результата: возрастная или skillLevel(с соответствующим префиксом gender).
  const currentCategoryName = getCurrentCategoryName({
    gender: gc.profile.gender,
    rawSkillLevelName: gc.categorySkillLevel,
    ageCategoryName: gc.categoryAge,
  });

  gc.positions.absolute = categoriesInRace.get('absolute')!;
  categoriesInRace.set('absolute', gc.positions.absolute + 1);

  if (isFemale) {
    gc.positions.absoluteGender = categoriesInRace.get('absoluteFemale')!;
    categoriesInRace.set('absoluteFemale', gc.positions.absoluteGender + 1);
  } else {
    gc.positions.absoluteGender = categoriesInRace.get('absoluteMale')!;
    categoriesInRace.set('absoluteMale', gc.positions.absoluteGender + 1);
  }

  const positionInCategory = categoriesInRace.get(currentCategoryName);
  if (positionInCategory) {
    gc.positions.category = positionInCategory;
    categoriesInRace.set(currentCategoryName, positionInCategory + 1);
  }
}
