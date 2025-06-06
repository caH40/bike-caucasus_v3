import { AgeCategory } from '@/database/mongodb/Models/AgeCategory';
import { errorLogger } from '@/errors/error';
import { TGender } from '@/types/index.interface';

type Params = {
  birthday: Date | string;
  ageCategoryVersion: string;
  gender?: TGender;
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
