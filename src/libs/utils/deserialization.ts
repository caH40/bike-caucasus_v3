import type { TNews } from '@/types/models.interface';

type TNewsCreateFromClient = Omit<TNews, 'blocks' | 'poster' | 'hashtags'> & {
  blocks: {
    text: string;
    image?: File | string;
    imageTitle?: string;
    position: number;
    imageOldUrl?: string;
    imageDeleted?: boolean; // true - изображение было удалено, новое не установленно.
  }[];
  poster?: File | string;
  hashtags: string | string[];
  urlSlug?: string;
  posterOldUrl?: string;
};

export function deserializeNewsCreate(formData: FormData) {
  const news = {} as TNewsCreateFromClient & { [key: string]: any };

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
    }, news);
  }

  return news as TNewsCreateFromClient;
}
