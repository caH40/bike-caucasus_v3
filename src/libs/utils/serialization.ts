import type { TNewsBlocksEdit } from '@/types/index.interface';

type Params = {
  blocks: TNewsBlocksEdit[]; // Блоки новостей, содержащие текст и изображения.
  title: string; // Заголовок новости.
  subTitle: string; // Подзаголовок новости.
  hashtags: string; // Хэштег новости.
  poster: File | null; // Изображение заголовка новости.
  urlSlug?: string; // urlSlug редактируемой новости, если его нет, значит новость создаётся.
  posterOldUrl?: string | null; // posterOldUrl старого постера, необходим для удаления файла из облака, если был изменен при редактировании новости.
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
  urlSlug,
  posterOldUrl,
}: Params): FormData {
  const formData = new FormData();
  formData.set('title', title);
  formData.set('subTitle', subTitle);
  formData.set('hashtags', hashtags);
  if (poster) {
    formData.set('poster', poster);
  }
  if (posterOldUrl) {
    formData.set('posterOldUrl', posterOldUrl);
  }
  if (urlSlug) {
    formData.set('urlSlug', urlSlug);
  }

  // Проход по каждому блоку новостей и добавление текстовых данных и изображений (если есть) в formData.
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].imageFile) {
      formData.set(`blocks[${i}][image]`, blocks[i].imageFile as File);
    }
    const imageOldUrl = blocks[i].imageOldUrl;
    if (imageOldUrl) {
      formData.set(`blocks[${i}][imageOldUrl]`, imageOldUrl);
    }
    formData.set(`blocks[${i}][position]`, String(blocks[i].position));
    formData.set(`blocks[${i}][text]`, blocks[i].text);
    formData.set(`blocks[${i}][imageTitle]`, blocks[i].imageTitle);

    const imageDeleted = blocks[i].imageDeleted;
    if (imageDeleted) {
      formData.set(`blocks[${i}][imageDeleted]`, String(imageDeleted));
    }
  }

  return formData;
}
