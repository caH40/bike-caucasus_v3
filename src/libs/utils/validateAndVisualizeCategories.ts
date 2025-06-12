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

export function validateAndVisualizeCategories({
  maleCategories,
  femaleCategories,
  ageCategoryGender,
}: Params): {
  visualCategories: TAgeCategoriesForVisual[];
  hasOverlappingCategory: boolean;
  hasEmptyCategory: boolean;
} {
  let hasEmptyCategory = false;
  let hasOverlappingCategory = false;
  const categories = ageCategoryGender === 'male' ? maleCategories : femaleCategories;

  if (categories.length === 0) {
    return { visualCategories: [], hasOverlappingCategory: false, hasEmptyCategory: false };
  }

  // Сортировка по возрастанию нижней границе возраста в категории.
  const sortedCategories = categories.toSorted((a, b) => +a.min - +b.min);

  // 1. Верхнюю границу первого блока сравнить с нижней границе следующего блока. Если равны или второе значение меньше первого, то произошло наложение. Если больше единицы, значит пустой промежуток между категориями.

  const visualCategories: TAgeCategoriesForVisual[] = [{ ...sortedCategories[0] }];
  // visualCategories.push()

  for (let i = 0; i < sortedCategories.length; i++) {
    const current = sortedCategories[i];
    const next = sortedCategories[i + 1];

    // Если i итерация последняя, то выход из цикла. Нет последующего блока, а значит не с чем сравнивать.
    if (!next) {
      continue;
    }

    if (next.min <= current.max) {
      // Наложение.
      visualCategories.push({ ...next, isWrong: true });

      hasOverlappingCategory = true;
    } else if (+next.min - +current.max > 1) {
      // Пустой промежуток. (Дополнительный блок)
      visualCategories.push({
        min: +current.max + 1,
        max: +next.min - 1,
        name: 'нет',
        isEmpty: true,
      });

      hasEmptyCategory = true;

      visualCategories.push(next);
    } else {
      // Нет ошибок, добавляется следующий блок.
      visualCategories.push(next);
    }
  }

  return { visualCategories, hasOverlappingCategory, hasEmptyCategory };
}
