import { TClientMeta, TFormDistanceCreate } from '@/types/index.interface';

/**
 * Функция для десериализации данных при создании дистанции.
 * @param dataForm - Данные формы, которые нужно десериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function deserializeDistance(serializedFormData: FormData) {
  const distance = {} as Omit<TFormDistanceCreate, 'trackGPXFile'> & {
    client: TClientMeta;
    trackGPXFile: File;
  } & {
    [key: string]: any;
  };

  for (const [name, value] of serializedFormData.entries()) {
    // Разбиваем имя на ключи с использованием регулярки /[\[\]]/ и фильтруем пустые строки.
    const keys = name.split(/[\[\]]/).filter(Boolean);

    keys.reduce((acc, cur, index) => {
      if (index === keys.length - 1) {
        // Если текущий индекс является последним, устанавливаем значение.
        // Последним значением передается value.

        // Восстановление типа значения.
        const handlerValue = (value: FormDataEntryValue) => {
          switch (cur) {
            case 'client':
              if (typeof value === 'string') {
                return JSON.parse(value);
              }

            case 'isEditForm':
              if (typeof value === 'string') {
                return value === 'true';
              }

            default:
              return value;
          }
        };

        acc[cur] = handlerValue(value);
      } else {
        if (!acc[cur]) {
          acc[cur] = isNaN(+keys[index + 1]) ? {} : [];
        }

        return acc[cur];
      }
    }, distance);
  }

  // Если данные из формы редактирования, то пропускается проверка.
  if (!distance.isEditForm && !distance.trackGPXFile) {
    throw new Error('Не получен GPX трек с клиента!');
  }

  return distance;
}
