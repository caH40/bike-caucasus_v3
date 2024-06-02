import type { TBlockInputInfo } from '@/types/index.interface';

type Params = {
  title: string; // Заголовок новости.
  region: string;
  difficultyLevel: string;
  startLocation: string;
  turnLocation: string;
  finishLocation: string;
  distance: number;
  ascent: number;
  garminConnect: string;
  komoot: string;
  hashtags: string;
  poster: File | null; // Изображение заголовка маршрута.
  urlSlug?: string; // urlSlug редактируемого маршрута, если его нет, значит маршрут создаётся.
  posterOldUrl?: string | null; // posterOldUrl старого постера, необходим для удаления файла из облака, если был изменен при редактировании новости.
  blocks: TBlockInputInfo[]; // Блоки новостей, содержащие текст и изображения.
};

/**
 * Функция для сериализации данных при создании новостей.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationTrailCreate({
  title,
  region,
  difficultyLevel,
  startLocation,
  turnLocation,
  finishLocation,
  distance,
  ascent,
  garminConnect,
  komoot,
  hashtags,
  blocks,
  poster,
  urlSlug,
  posterOldUrl,
}: Params): FormData {
  const formData = new FormData();
  formData.set('title', title);
  formData.set('region', region);
  formData.set('difficultyLevel', difficultyLevel);
  formData.set('startLocation', startLocation);
  if (turnLocation) {
    formData.set('turnLocation', turnLocation);
  }
  formData.set('finishLocation', finishLocation);
  formData.set('distance', String(distance));
  formData.set('ascent', String(ascent));
  formData.set('garminConnect', garminConnect);
  formData.set('komoot', komoot);
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
      formData.set(`blocks[${i}][imageFile]`, blocks[i].imageFile as File);
    }
    const imageOldUrl = blocks[i].imageOldUrl;
    if (imageOldUrl) {
      formData.set(`blocks[${i}][imageOldUrl]`, imageOldUrl);
    }
    formData.set(`blocks[${i}][position]`, String(blocks[i].position));
    formData.set(`blocks[${i}][text]`, blocks[i].text);

    const imageTitle = blocks[i].imageTitle;
    if (imageTitle) {
      formData.set(`blocks[${i}][imageTitle]`, imageTitle);
    }

    const imageDeleted = blocks[i].imageDeleted;
    if (imageDeleted) {
      formData.set(`blocks[${i}][imageDeleted]`, String(imageDeleted));
    }

    const title = blocks[i].title;
    if (title) {
      formData.set(`blocks[${i}][video]`, title);
    }

    const video = blocks[i].video;
    if (video) {
      formData.set(`blocks[${i}][video]`, video);
    }
  }

  return formData;
}
