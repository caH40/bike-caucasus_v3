import {
  formatAgeCategories,
  formatSkillLevelCategories,
} from '@/components/UI/Forms/FormChampionship/categories-format';
import { content } from '@/libs/utils/text';
import type { TCategoriesConfigsForm, TClientMeta } from '@/types/index.interface';

/**
 * Функция для сериализации данных по категориям Чемпионата для передачи на сервер.
 * @param dataForm - Данные формы, которые нужно сериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationChampionshipCategories({
  dataForm,
  client,
}: {
  dataForm: TCategoriesConfigsForm[];
  client?: TClientMeta;
}): FormData {
  const formData = new FormData();

  const formattedCategories = dataForm.map((categories) => {
    return {
      ...categories,
      _id: categories._id ? content.cleanText(categories._id) : undefined,
      name: content.cleanText(categories.name),
      description: categories.description ? content.cleanText(categories.description) : '',
      age: {
        male: categories.age?.male
          ? formatAgeCategories({ ageCategories: categories.age.male, gender: 'male' })
          : [],
        female: categories.age?.female
          ? formatAgeCategories({ ageCategories: categories.age.female, gender: 'female' })
          : [],
      },
      skillLevel: categories.skillLevel
        ? formatSkillLevelCategories(categories.skillLevel)
        : undefined,
    };
  });

  formData.append('categoriesConfigs', JSON.stringify(formattedCategories));

  if (client) {
    formData.set('client', JSON.stringify(client));
  }

  return formData;
}
