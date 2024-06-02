import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { lcSuffixTrailModeration as suffix } from '@/constants/local-storage';
import { TBlockInputInfo } from '@/types/index.interface';

type Props = {
  title: string;
  hashtags: string;
  blocks: TBlockInputInfo[];
  resetData: boolean;
  target: 'edit' | 'create'; // указывает какая форма используется.
};

type PropsInit = {
  setBlocks: Dispatch<SetStateAction<TBlockInputInfo[]>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setHashtags: Dispatch<SetStateAction<string>>;
  initialBlocks: TBlockInputInfo[];
  isEditing: boolean; // Происходит редактирование или создание маршрута.
  target: 'edit' | 'create'; // указывает какая форма используется.
};

// Суффикс для локального хранилища.

/**
 * Хук сохраняет вводимые данные в форме создания Маршрута.
 */
export function useLSTrail({ title, hashtags, blocks, resetData, target }: Props) {
  useEffect(() => {
    if (target === 'edit') {
      return;
    }

    if (!title) {
      return;
    }
    localStorage.setItem(`${suffix}${target}-title`, title);
  }, [title, target]);

  useEffect(() => {
    if (target === 'edit') {
      return;
    }

    if (!hashtags) {
      return;
    }
    localStorage.setItem(`${suffix}${target}-hashtags`, hashtags);
  }, [hashtags, target]);

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

  useEffect(() => {
    if (target === 'edit') {
      return;
    }

    if (!resetData) {
      return;
    }
    localStorage.removeItem(`${suffix}${target}-title`);
    localStorage.removeItem(`${suffix}${target}-hashtags`);
    localStorage.removeItem(`${suffix}${target}-blocks`);
  }, [resetData, target]);
}

/**
 * Хук инициализирует данные в форме создания Маршрута (trail) из Локального хранилища.
 */
export function useLSTrailInit({
  setBlocks,
  setTitle,
  setHashtags,
  isEditing,
  initialBlocks,
  target,
}: PropsInit): void {
  useEffect(() => {
    // Получение данных с Локального хранилища браузера.
    if (isEditing) {
      setBlocks(initialBlocks);
      // Не использовать Локальное хранилище при редактировании новости,
      // так как формы новости заполняются из БД.
      return;
    } else {
      const blocksLS = localStorage.getItem(`${suffix}${target}-blocks`);
      const blockParsed = blocksLS && JSON.parse(blocksLS);
      // проверка, что blockParsed существует и является массивом в нулевом элементе которого
      // есть свойство position, иначе возвращается initialBlocks
      const initBlocks = blockParsed && blockParsed[0].position ? blockParsed : initialBlocks;
      setBlocks(initBlocks);
    }

    const initTitle = localStorage.getItem(`${suffix}${target}-title`) || '';
    const initHashtags = localStorage.getItem(`${suffix}${target}-hashtags`) || '';

    setTitle(initTitle);
    setHashtags(initHashtags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
