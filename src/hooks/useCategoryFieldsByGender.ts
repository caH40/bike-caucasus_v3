import { useFieldArray, Control } from 'react-hook-form';
import { TCategoriesConfigsClient } from '@/types/index.interface';

/**
 * Хук для работы с полями категорий (например, возрастных или по скиллу),
 * разделённых по полу (male/female), внутри формы с использованием react-hook-form.
 * @param control - объект управления формой от useForm.
 * @param genderButtonNumber - номер активной кнопки пола (0 — male, 1 — female).
 * @param fieldPathRoot - путь до поля age или skillLevel.
 */
export function useCategoryFieldsByGender({
  control,
  genderButtonNumber,
  fieldPathRoot,
}: {
  control: Control<{ categories: TCategoriesConfigsClient[] }>;
  categoriesIndex: number;
  genderButtonNumber: number;
  fieldPathRoot: `categories.${number}.age` | `categories.${number}.skillLevel`;
}) {
  // Определяем пол на основе выбранной кнопки.
  const isMale = genderButtonNumber === 0;
  const categoryProperty: 'male' | 'female' = isMale ? 'male' : 'female';

  // Работаем с массивом male-подкатегорий.
  const {
    fields: maleFields,
    append: appendMale,
    remove: removeMale,
  } = useFieldArray({
    control,
    name: `${fieldPathRoot}.male`,
  });

  // Работаем с массивом female-подкатегорий.
  const {
    fields: femaleFields,
    append: appendFemale,
    remove: removeFemale,
  } = useFieldArray({
    control,
    name: `${fieldPathRoot}.female`,
  });

  // Выбираем активные поля и методы в зависимости от пола.
  const currentFields = isMale ? maleFields : femaleFields;
  const append = isMale ? appendMale : appendFemale;
  const remove = isMale ? removeMale : removeFemale;

  return {
    currentFields, // Текущий массив полей (в зависимости от пола).
    append, // Метод добавления новой подкатегории.
    remove, // Метод удаления подкатегории.
    categoryProperty, // Строка 'male' или 'female'.
  };
}
