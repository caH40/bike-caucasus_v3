import { useEffect } from 'react';

import { lcSuffixTrailModeration as suffix } from '@/constants/local-storage';
import { TBlockInputInfo } from '@/types/index.interface';

type Props = {
  title: string;
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
  blocks: TBlockInputInfo[];
  resetData: boolean;
  target: 'edit' | 'create'; // указывает какая форма используется.
};

// Суффикс для локального хранилища.

/**
 * Хук сохраняет вводимые данные в форме создания Маршрута.
 */
export function useLSTrail({
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
  resetData,
  target,
}: Props) {
  // Сохранение заголовка (title).
  useSaveToLC('title', title, target);

  // Сохранение региона (region).
  useSaveToLC('region', region, target);

  // Сохранение уровня сложности (difficultyLevel).
  useSaveToLC('difficultyLevel', difficultyLevel, target);

  // Сохранение места старта (startLocation).
  useSaveToLC('startLocation', startLocation, target);

  // Сохранение места разворота (turnLocation).
  useSaveToLC('turnLocation', turnLocation, target);

  // Сохранение места разворота (finishLocation).
  useSaveToLC('finishLocation', finishLocation, target);

  // Сохранение общей дистанции в метрах (distance).
  useSaveToLC('distance', distance, target);

  // Сохранение общего набора в метрах (ascent).
  useSaveToLC('ascent', ascent, target);

  // Сохранение ссылки на маршрут в garminConnect (garminConnect).
  useSaveToLC('garminConnect', garminConnect, target);

  // Сохранение ссылки на маршрут в komoot (komoot).
  useSaveToLC('komoot', komoot, target);

  // Сохранение Хэштэгов (hashtags).
  useSaveToLC('hashtags', hashtags, target);

  // сохранение данных блоков в Локальном хранилище при изменении blocks
  useEffect(() => {
    if (target === 'edit') {
      return;
    }

    if (!blocks.length || !blocks[0].text) {
      return;
    }

    const blocksWithoutImage = blocks.map((block) => ({
      image: null,
      text: block.text,
      position: block.position,
      imageTitle: block.imageTitle,
      title: block.title,
      video: block.video,
    }));

    localStorage.setItem(`${suffix}${target}-blocks`, JSON.stringify(blocksWithoutImage));
  }, [blocks, target]);

  // Удаление из Локального хранилища всех данных о Маршруте
  useEffect(() => {
    if (target === 'edit') {
      return;
    }

    if (!resetData) {
      return;
    }
    localStorage.removeItem(`${suffix}${target}-title`);
    localStorage.removeItem(`${suffix}${target}-region`);
    localStorage.removeItem(`${suffix}${target}-difficultyLevel`);
    localStorage.removeItem(`${suffix}${target}-startLocation`);
    localStorage.removeItem(`${suffix}${target}-turnLocation`);
    localStorage.removeItem(`${suffix}${target}-finishLocation`);
    localStorage.removeItem(`${suffix}${target}-distance`);
    localStorage.removeItem(`${suffix}${target}-ascent`);
    localStorage.removeItem(`${suffix}${target}-garminConnect`);
    localStorage.removeItem(`${suffix}${target}-komoot`);
    localStorage.removeItem(`${suffix}${target}-hashtags`);
    localStorage.removeItem(`${suffix}${target}-blocks`);
  }, [resetData, target]);
}

/**
 *Сохраняет простые данные String или Number в Локальное хранилище.
 */
function useSaveToLC(property: string, value: string | number, target: string) {
  useEffect(() => {
    if (target === 'edit') {
      return;
    }

    if (!value) {
      return;
    }

    localStorage.setItem(`${suffix}${target}-${property}`, String(value));
  }, [value, target, property]);
}
