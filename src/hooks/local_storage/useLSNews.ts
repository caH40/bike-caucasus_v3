import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { lcSuffixNewsCreate as suffix } from '@/constants/local-storage';
import { TNewsBlocksEdit } from '@/types/index.interface';

type Props = {
  title: string;
  subTitle: string;
  hashtags: string;
  blocks: TNewsBlocksEdit[];
  resetData: boolean;
};

type PropsInit = {
  setBlocks: Dispatch<SetStateAction<TNewsBlocksEdit[]>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setSubTitle: Dispatch<SetStateAction<string>>;
  setHashtags: Dispatch<SetStateAction<string>>;
  initialBlocks: TNewsBlocksEdit[];
};

// Суффикс для локального хранилища.

/**
 * Хук сохраняет вводимые данные в форме создания Новости.
 */
export function useLSNews({ title, subTitle, hashtags, blocks, resetData }: Props) {
  useEffect(() => {
    if (!title) {
      return;
    }
    localStorage.setItem(`${suffix}title`, title);
  }, [title]);

  useEffect(() => {
    if (!subTitle) {
      return;
    }
    localStorage.setItem(`${suffix}subTitle`, subTitle);
  }, [subTitle]);

  useEffect(() => {
    if (!hashtags) {
      return;
    }
    localStorage.setItem(`${suffix}hashtags`, hashtags);
  }, [hashtags]);

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

    localStorage.setItem(`${suffix}blocks`, JSON.stringify(blocksWithoutImage));
  }, [blocks]);

  useEffect(() => {
    if (!resetData) {
      return;
    }
    localStorage.removeItem(`${suffix}title`);
    localStorage.removeItem(`${suffix}subTitle`);
    localStorage.removeItem(`${suffix}hashtags`);
    localStorage.removeItem(`${suffix}blocks`);
  }, [resetData]);
}

/**
 * Хук инициализирует данные в форме создания Новости из Локального хранилища.
 */
export function useLSNewsInit({
  setBlocks,
  setTitle,
  setSubTitle,
  setHashtags,
  initialBlocks,
}: PropsInit): void {
  useEffect(() => {
    // Получение данных с Локального хранилища браузера.
    const blocksLS = localStorage.getItem(`${suffix}blocks`);
    const blockParsed = blocksLS && JSON.parse(blocksLS);
    // проверка, что blockParsed существует и является массивом в нулевом элементе которого
    // есть свойство position, иначе возвращается initialBlocks
    const initBlocks = blockParsed && blockParsed[0].position ? blockParsed : initialBlocks;

    const initTitle = localStorage.getItem(`${suffix}title`) || '';
    const initSubTitle = localStorage.getItem(`${suffix}subTitle`) || '';
    const initHashtags = localStorage.getItem(`${suffix}hashtags`) || '';

    setBlocks(initBlocks);
    setTitle(initTitle);
    setSubTitle(initSubTitle);
    setHashtags(initHashtags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
