import type { TNewsBlocksEdit } from '@/types/index.interface';

type Params = {
  newsBlocks: TNewsBlocksEdit[]; // Блоки новостей, содержащие текст и изображения.
  title: string; // Заголовок новости.
  subTitle: string; // Подзаголовок новости.
  hashtag: string; // Хэштег новости.
  fileImageTitle: File | null; // Изображение заголовка новости.
};

/**
 * Функция для сериализации данных при создании новостей.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationNewsCreate({
  newsBlocks,
  title,
  subTitle,
  hashtag,
  fileImageTitle,
}: Params): FormData {
  const formData = new FormData();
  formData.set('title', title);
  formData.set('subTitle', subTitle);
  formData.set('hashtag', hashtag);
  if (fileImageTitle) {
    formData.set('fileImageTitle', fileImageTitle);
  }

  // Если заголовочное изображение присутствует, добавляем его в formData.
  newsBlocks.forEach((block) => {
    if (block.imageFile) {
      block.imageFile;
    }
  });

  // Проход по каждому блоку новостей и добавление текстовых данных и изображений (если есть) в formData.
  for (let i = 0; i < newsBlocks.length; i++) {
    if (newsBlocks[i].imageFile) {
      formData.set(`newsBlocks[${i}][image]`, newsBlocks[i].imageFile as File);
    }
    formData.set(`newsBlocks[${i}][position]`, String(newsBlocks[i].position));
    formData.set(`newsBlocks[${i}][text]`, newsBlocks[i].text);
  }

  return formData;
}
