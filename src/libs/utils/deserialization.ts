import type { TNews } from '@/types/models.interface';

type TNewsCreateFromClient = Omit<TNews, 'blocks' | 'poster' | 'hashtags'> & {
  blocks: {
    text: string;
    image?: File | string;
    position: number;
  }[];
  poster?: File | string;
  hashtags: string | string[];
  // hashtagsArray?: string[];
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

        acc[cur] = cur === 'position' ? +value : value;
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