import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { lcSuffixNewsCreate as suffix } from '@/constants/local-storage';
import { TNewsBlocksEdit } from '@/types/index.interface';

type Props = {
  title: string;
  subTitle: string;
  hashtags: string;
  blocks: TNewsBlocksEdit[];
  resetData: boolean;
  target: 'edit' | 'create'; // указывает какая форма используется.
};

type PropsInit = {
  setBlocks: Dispatch<SetStateAction<TNewsBlocksEdit[]>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setSubTitle: Dispatch<SetStateAction<string>>;
  setHashtags: Dispatch<SetStateAction<string>>;
  initialBlocks: TNewsBlocksEdit[];
  isEditing: boolean; // Происходит редактирование или создание новости.
  target: 'edit' | 'create'; // указывает какая форма используется.
};

// Суффикс для локального хранилища.

/**
 * Хук сохраняет вводимые данные в форме создания Новости.
 */
export function useLSNews({ title, subTitle, hashtags, blocks, resetData, target }: Props) {
  useEffect(() => {
    if (!title) {
      return;
    }
    localStorage.setItem(`${suffix}${target}-title`, title);
  }, [title, target]);

  useEffect(() => {
    if (!subTitle) {
      return;
    }
    localStorage.setItem(`${suffix}${target}-subTitle`, subTitle);
  }, [subTitle, target]);

  useEffect(() => {
    if (!hashtags) {
      return;
    }
    localStorage.setItem(`${suffix}${target}-hashtags`, hashtags);
  }, [hashtags, target]);

  // сохранение данных блоков в Локальном хранилище при изменении blocks
  useEffect(() => {
    if (!blocks.length || !blocks[0].text) {
      return;
    }

    const blocksWithoutImage = blocks.map((block) => ({
      image: null,
      text: block.text,
      position: block.position,
      imageTitle: block.imageTitle,
    }));

    localStorage.setItem(`${suffix}${target}-blocks`, JSON.stringify(blocksWithoutImage));
  }, [blocks, target]);

  useEffect(() => {
    if (!resetData) {
      return;
    }
    localStorage.removeItem(`${suffix}${target}-title`);
    localStorage.removeItem(`${suffix}${target}-subTitle`);
    localStorage.removeItem(`${suffix}${target}-hashtags`);
    localStorage.removeItem(`${suffix}${target}-blocks`);
  }, [resetData, target]);
}

/**
 * Хук инициализирует данные в форме создания Новости из Локального хранилища.
 */
export function useLSNewsInit({
  setBlocks,
  setTitle,
  setSubTitle,
  setHashtags,
  isEditing,
  initialBlocks,
  target,
}: PropsInit): void {
  useEffect(() => {
    // Получение данных с Локального хранилища браузера.
    if (isEditing) {
      setBlocks(initialBlocks);
    } else {
      const blocksLS = localStorage.getItem(`${suffix}${target}-blocks`);
      const blockParsed = blocksLS && JSON.parse(blocksLS);
      // проверка, что blockParsed существует и является массивом в нулевом элементе которого
      // есть свойство position, иначе возвращается initialBlocks
      const initBlocks = blockParsed && blockParsed[0].position ? blockParsed : initialBlocks;
      setBlocks(initBlocks);
    }

    const initTitle = localStorage.getItem(`${suffix}${target}-title`) || '';
    const initSubTitle = localStorage.getItem(`${suffix}${target}-subTitle`) || '';
    const initHashtags = localStorage.getItem(`${suffix}${target}-hashtags`) || '';

    setTitle(initTitle);
    setSubTitle(initSubTitle);
    setHashtags(initHashtags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
