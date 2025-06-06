import { MAX_ATHLETE_AGE } from "@/constants/category";
import { TCategoryAge, TGender } from "@/types/index.interface";

/**
 * Получение возрастной категории для Райдера (yearBirthday) на основании категорий categoriesAge, установленных в заезде.
 *
 * @param {number} yearBirthday - Год рождения райдера.
 * @param {TCategoryAge[]} categoriesAge - Массив возрастных категорий.
 * @param {'M' | 'F'} gender - Пол райдера (M - мужчина, F - женщина).
 *
 * @returns {string} - Возрастная категория райдера.
 */
export function createStringCategoryAge({
  yearBirthday,
  categoriesAge,
  gender,
}: {
  yearBirthday: number;
  categoriesAge: TCategoryAge[];
  gender: TGender;
}): string {
  // Проверка валидности года рождения.
  if (!yearBirthday || +yearBirthday === 0) {
    throw new Error('Не получен год рождения райдера, проверьте данные!');
  }

  const error = `Нет ${
    gender === 'female' ? 'женской' : 'мужской'
  } возрастной категории для запрашиваемого года рождения: ${yearBirthday}. Добавьте соответствующую возрастную категорию в настройки Заезда.`;

  if (!categoriesAge) {
    throw new Error(error);
  }

  // Возраст в годах: текущий год - год рождения.
  const fullYear = new Date().getFullYear() - yearBirthday;

  const shortGender: Record<TGender, 'M' | 'F'> = {
    female: 'F',
    male: 'M',
  };

  // Проходим по каждой категории и проверяем, попадает ли возраст в диапазон.
  for (const category of categoriesAge) {
    if (fullYear >= category.min && fullYear <= category.max) {
      if (category.max === MAX_ATHLETE_AGE) {
        // Если название категории было задано, то возвращается оно.
        // Категория без верхнего предела.
        return category.name || `${shortGender[gender]}${category.min}+`;
      } else {
        return category.name || `${shortGender[gender]}${category.min}-${category.max}`; // Категория с указанием диапазона.
      }
    }
  }

  // Если ни одна категория не подошла.
  return 'нет категории';
}
