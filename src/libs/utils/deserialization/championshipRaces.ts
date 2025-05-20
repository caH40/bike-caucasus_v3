import { TDeserializedRacesData } from '@/types/index.interface';

/**
 * Функция для десериализации данных при редактировании заездов Чемпионата.
 * @param dataForm - Данные формы, которые нужно десериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function deserializeRaces(serializedFormData: FormData): TDeserializedRacesData {
  const data = {} as TDeserializedRacesData;

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
            // Если ключ number то возвращается число.
            case 'number':
              return +value;

            // Если ключ distance то возвращается число.
            case 'distance':
              return +value;

            // Если ключ laps то возвращается число.
            case 'laps':
              return +value;

            // Если ключ ascent то возвращается число.
            case 'ascent':
              return value ? +value : 0;

            // Если ключ urlTracksForDel парсить.
            case 'urlTracksForDel':
              if (typeof value === 'string') {
                return JSON.parse(value);
              }

            default:
              return value;
          }
        };

        acc[cur] = handlerValue(value);
      } else {
        if (!acc[cur]) {
          // Если текущий ключ не существует в объекте, создаем либо пустой объект {},
          // либо пустой массив [], в зависимости от следующего ключа.
          // при сериализации делали для массива вторым ключом число, проверка isNaN(keys[index + 1]).
          acc[cur] = isNaN(+keys[index + 1]) ? {} : [];
        }

        return acc[cur];
      }
    }, data);
  }

  return data;
}
