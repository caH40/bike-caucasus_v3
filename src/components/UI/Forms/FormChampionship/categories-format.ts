import { content } from '@/libs/utils/text';

// types
import {
  TAgeCategoryFromForm,
  TCategoryAge,
  TCategorySkillLevel,
} from '@/types/index.interface';

const AGE_MAX = 120; // Максимально допустимый возраст для спортсменов.

type TFormattedNameParams = TCategoryAge & {
  letterForGender: string;
};

/**
 * Формирует имя категории на основе минимального и максимального возраста и пола.
 * min - Минимальное значение возраста.
 * max - Максимальное значение возраста.
 * name - Название категории, введенное пользователем.
 * letterForGender - Буква, обозначающая пол (М - для мужчин, Ж - для женщин).
 * @returns {string} - Форматированное имя категории.
 */
function getFormattedName({ min, max, name, letterForGender }: TFormattedNameParams): string {
  const nameTrimmed = name.trim();
  const minNum = Number(min);
  const maxNum = Number(max);
  const maxNotLimit = maxNum >= AGE_MAX;

  if (nameTrimmed) {
    return nameTrimmed;
  }

  return maxNotLimit ? `${letterForGender}${minNum}+` : `${letterForGender}${minNum}-${maxNum}`;
}

/**
 * Форматирует массив возрастных категорий, преобразуя строки в числа и формируя правильные имена категорий.
 * @param {TCategoryAgeFromForm[]} categoriesAge - Массив возрастных категорий из формы.
 * @param {'male' | 'female'} gender - Пол спортсменов (male для мужчин, female для женщин).
 * @returns {TCategoryAge[]} - Массив форматированных возрастных категорий с числами и именами.
 */
export function formatAgeCategories({
  ageCategories,
  gender,
}: {
  ageCategories: TAgeCategoryFromForm[];
  gender: 'male' | 'female';
}): TCategoryAge[] {
  if (ageCategories.length === 0) {
    return [];
  }

  const letterForGender = gender === 'female' ? 'Ж' : 'М'; // Определение буквы для пола.

  // Преобразуем каждую категорию из формы в форматированную категорию.
  return ageCategories.map((category) => {
    const min = Number(category.min);
    const max = category.max ? Number(category.max) : AGE_MAX;

    // Формируем объект категории с отформатированными значениями.
    return {
      min,
      max,
      name: getFormattedName({ min, max, name: category.name, letterForGender }),
    };
  });
}

type SkillLevelCategoriesConfigs = {
  female: TCategorySkillLevel[];
  male: TCategorySkillLevel[];
};

/**
 * Проверка на наличие категорий по уровню подготовки.
 */
function checkSkillLevelCategories(skillLevelCategoriesConfigs: SkillLevelCategoriesConfigs): {
  hasMale: boolean;
  hasFemale: boolean;
} {
  const hasMale = skillLevelCategoriesConfigs?.male.length > 0;
  const hasFemale = skillLevelCategoriesConfigs?.female.length > 0;

  return { hasMale, hasFemale };
}

/**
 * Форматирует категории по уровню подготовки, очищая текстовые поля и
 * возвращая объект с массивами категорий для мужчин и женщин.
 * Если входной объект не содержит ни мужских, ни женских категорий, возвращает `undefined`.
 * @param {SkillLevelCategoriesConfigs} skillLevelCategoriesConfigs - Объект с категориями по уровню подготовки, содержащий поля `male` и `female`.
 * @returns {{ male: TCategorySkillLevel[]; female: TCategorySkillLevel[] } | undefined} Отформатированный объект категорий с очищенными полями `name` и `description`,
 * либо `undefined`, если категории отсутствуют.
 */
export function formatSkillLevelCategories(
  skillLevelCategoriesConfigs: SkillLevelCategoriesConfigs
): { male: TCategorySkillLevel[]; female: TCategorySkillLevel[] } | undefined {
  const { hasMale, hasFemale } = checkSkillLevelCategories(skillLevelCategoriesConfigs);

  // Если нет ни мужских не женских категорий, значит поле skillLevel === undefined
  if (!hasMale && !hasFemale) {
    return undefined;
  }

  function cleanCategories(categories: TCategorySkillLevel[]) {
    return categories.map((elm) => ({
      name: content.cleanText(elm.name),
      description: elm.description ? content.cleanText(elm.description) : undefined,
    }));
  }

  const male = hasMale ? cleanCategories(skillLevelCategoriesConfigs.male) : [];
  const female = hasFemale ? cleanCategories(skillLevelCategoriesConfigs.female) : [];

  return { male, female };
}
