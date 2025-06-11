import { TClientMeta, TTrailCreateFromClient } from '@/types/index.interface';

/**
 *
 */
export function deserializeTrailCreate(formData: FormData) {
  const trail = {} as TTrailCreateFromClient & { isEditing: boolean; client?: TClientMeta } & {
    [key: string]: any;
  };

  for (const [name, value] of formData.entries()) {
    // Разбиваем имя на ключи с использованием регулярки /[\[\]]/ и фильтруем пустые строки.
    const keys = name.split(/[\[\]]/).filter(Boolean);

    keys.reduce((acc, cur, index) => {
      if (index === keys.length - 1) {
        // Если текущий индекс является последним, устанавливаем значение.
        // Последним значением передается value.

        // Восстановление типа значения.
        const handlerValue = (value: FormDataEntryValue) => {
          switch (cur) {
            // Если ключ position то возвращается число.
            case 'position':
              return +value;

            // Если ключ imageDeleted то возвращается булево значение.
            case 'imageDeleted':
              return value === 'true' ? true : false;

            case 'isEditing':
              return value === 'true' ? true : false;

            case 'client':
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
    }, trail);
  }

  return trail as TTrailCreateFromClient;
}
