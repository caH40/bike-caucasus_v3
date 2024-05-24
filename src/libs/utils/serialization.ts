import type { TNewsBlocksEdit } from '@/types/index.interface';

type Params = {
  blocks: TNewsBlocksEdit[]; // Блоки новостей, содержащие текст и изображения.
  title: string; // Заголовок новости.
  subTitle: string; // Подзаголовок новости.
  hashtags: string; // Хэштег новости.
  poster: File | null; // Изображение заголовка новости.
};

/**
 * Функция для сериализации данных при создании новостей.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationNewsCreate({
  blocks,
  title,
  subTitle,
  hashtags,
  poster,
}: Params): FormData {
  const formData = new FormData();
  formData.set('title', title);
  formData.set('subTitle', subTitle);
  formData.set('hashtags', hashtags);
  if (poster) {
    formData.set('poster', poster);
  }

  // Если заголовочное изображение присутствует, добавляем его в formData.
  blocks.forEach((block) => {
    if (block.imageFile) {
      block.imageFile;
    }
  });

  // Проход по каждому блоку новостей и добавление текстовых данных и изображений (если есть) в formData.
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].imageFile) {
      formData.set(`blocks[${i}][image]`, blocks[i].imageFile as File);
    }
    formData.set(`blocks[${i}][position]`, String(blocks[i].position));
    formData.set(`blocks[${i}][text]`, blocks[i].text);
    formData.set(`blocks[${i}][imageTitle]`, blocks[i].imageTitle);
  }

  return formData;
}
