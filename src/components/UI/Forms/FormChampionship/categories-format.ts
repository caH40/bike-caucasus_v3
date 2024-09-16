import { TCategoryAgeFromForm } from '@/types/index.interface';

type TCategoriesAgeFromForm = {
  categoriesAgeFemale: TCategoryAgeFromForm[]; // Массив женских возрастных категорий.
  categoriesAgeMale: TCategoryAgeFromForm[]; // Массив мужских возрастных категорий.
};

type TCategoriesAge = {
  categoriesAgeFemale: TCategoryAgeFromForm[]; // Массив форматированных женских категорий.
  categoriesAgeMale: TCategoryAgeFromForm[]; // Массив форматированных мужских категорий.
};

const ageMax = 120; // Максимально допустимый возраст для спортсменов.

/**
 * Формирует имя категории на основе минимального и максимального возраста и пола.
 * min - Минимальное значение возраста.
 * max - Максимальное значение возраста.
 * name - Название категории, введенное пользователем.
 * letterForGender - Буква, обозначающая пол (М - для мужчин, Ж - для женщин).
 * @returns {string} - Форматированное имя категории.
 */
function getFormattedName({
  min,
  max,
  name,
  letterForGender,
}: {
  min: string;
  max: string;
  name: string;
  letterForGender: string;
}): string {
  const nameTrimmed = name.trim(); // Удаление лишних пробелов из имени категории.
  const maxNotLimit = +max >= ageMax; // Проверка, если максимальный возраст не ограничен.

  // Форматирование имени категории: если max не ограничен, формат "Ж10+" или "М10+".
  // Иначе формат "Ж10-20" или "М10-20".
  if (maxNotLimit) {
    return nameTrimmed === '' ? `${letterForGender}${min}+` : nameTrimmed;
  }

  return nameTrimmed === '' ? `${letterForGender}${min}-${max}` : nameTrimmed;
}

/**
 * Форматирует массив возрастных категорий, преобразуя строки в числа и формируя правильные имена категорий.
 * @param {TCategoryAgeFromForm[]} categoriesAge - Массив возрастных категорий из формы.
 * @param {'male' | 'female'} gender - Пол спортсменов (male для мужчин, female для женщин).
 * @returns {TCategoryAge[]} - Массив форматированных возрастных категорий с числами и именами.
 */
function formatCategoryAge({
  categoriesAge,
  gender,
}: {
  categoriesAge: TCategoryAgeFromForm[];
  gender: 'male' | 'female';
}): TCategoryAgeFromForm[] {
  const letterForGender = gender === 'female' ? 'Ж' : 'М'; // Определение буквы для пола.

  // Преобразуем каждую категорию из формы в форматированную категорию.
  return categoriesAge.map((category) => {
    const min = category.min; // Преобразуем минимальное значение в число.
    const max = category.max; // Преобразуем максимальное значение в число.

    // Формируем объект категории с отформатированными значениями.
    return {
      min,
      max,
      name: getFormattedName({ min, max, name: category.name, letterForGender }),
    };
  });
}

/**
 * Обрабатывает и форматирует возрастные категории для мужчин и женщин, преобразуя их из формы в удобный формат.
 * @param {TCategoriesAgeFromForm} categoriesAge - Массивы возрастных категорий для мужчин и женщин из формы.
 * @returns {TCategoriesAge} - Обработанные и форматированные категории для мужчин и женщин.
 */
export function formatCategoriesFields({
  categoriesAgeFemale,
  categoriesAgeMale,
}: TCategoriesAgeFromForm): TCategoriesAge {
  // Форматируем женские категории.
  const categoriesAgeFemaleFormatted = formatCategoryAge({
    categoriesAge: categoriesAgeFemale,
    gender: 'female',
  });

  // Форматируем мужские категории.
  const categoriesAgeMaleFormatted = formatCategoryAge({
    categoriesAge: categoriesAgeMale,
    gender: 'male',
  });

  // Возвращаем обработанные категории.
  return {
    categoriesAgeFemale: categoriesAgeFemaleFormatted,
    categoriesAgeMale: categoriesAgeMaleFormatted,
  };
}
