import { AgeCategory } from '@/database/mongodb/Models/AgeCategory';
import { errorLogger } from '@/errors/error';
import { TCategoryAge } from '@/types/index.interface';

type Params = {
  birthday: Date | string;
  ageCategoryVersion: string;
  gender?: 'male' | 'female';
};

/**
 * Преобразование даты рождения в Возрастную категорию для отображения в профиле.
 */
export async function getCategoryAgeProfile({
  birthday,
  ageCategoryVersion,
  gender = 'male',
}: Params): Promise<string | null> {
  try {
    const today = new Date();
    const birthDate = new Date(birthday);

    if (isNaN(birthDate.getTime())) {
      throw new Error('Неверный формат даты рождения');
    }

    // Возраст в полных годах с учетом месяца и дня рождения.
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    // Получение название категории, соответствующей запрашиваемым параметрам.
    const ageCategoryDB = await AgeCategory.findOne(
      {
        version: ageCategoryVersion,
        $and: [{ 'age.min': { $lte: age } }, { 'age.max': { $gte: age } }],
        gender,
      },
      { name: true, _id: false }
    ).lean<{ name: string }>();

    if (!ageCategoryDB) {
      throw new Error(
        `Категория с названием категоризации ${ageCategoryVersion} для возраста ${age} не найдена!`
      );
    }

    return ageCategoryDB.name;
  } catch (error) {
    errorLogger(error);
    return null;
  }
}

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
  gender: 'M' | 'F';
}): string {
  // Проверка валидности года рождения.
  if (!yearBirthday || +yearBirthday === 0) {
    throw new Error('Не получен год рождения райдера, проверьте данные!');
  }

  const error = `Нет ${
    gender === 'F' ? 'женской' : 'мужской'
  } возрастной категории для запрашиваемого года рождения: ${yearBirthday}. Добавьте соответствующую возрастную категорию в настройки Заезда.`;

  if (!categoriesAge) {
    throw new Error(error);
  }

  const fullYear = new Date().getFullYear() - yearBirthday;

  // Проходим по каждой категории и проверяем, попадает ли возраст в диапазон.
  for (const category of categoriesAge) {
    if (fullYear >= category.min && fullYear <= category.max) {
      const maxAge = 200; // Предположительно, максимальное значение 200 используется для открытых категорий.
      if (category.max === maxAge) {
        return `${gender}${category.min}+`; // Категория без верхнего предела.
      } else {
        return `${gender}${category.min}-${category.max}`; // Категория с указанием диапазона.
      }
    }
  }

  // Если ни одна категория не подошла.
  throw new Error(error);
}
