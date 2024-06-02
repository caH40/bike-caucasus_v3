// Небольшие утилиты для компоненты FormNewsCreate

import { content } from '@/libs/utils/text';
import type { TBlockInputInfo } from '@/types/index.interface';

type Params = {
  title: string;
  startLocation: string;
  turnLocation: string;
  finishLocation: string;
  distance: number;
  ascent: number;
  garminConnect: string;
  komoot: string;
  hashtags: string;
  blocks: TBlockInputInfo[];
  [key: string]: any;
};

type TFlatData = Omit<Params, 'blocks' | '[key: string]: unknown'>;

/**
 * Очищает тексты маршрута от тэгов HTML, кроме <a> и <br>,
 * и заменяет символы CRLF перевода строк на HTML тэг <br>.
 *
 * @param params - Объект с данными маршрута.
 * @returns Объект с очищенными и форматированными данными.
 */
export function formateAndStripContent(params: Params): {
  flatData: TFlatData;
  blockFormatted: TBlockInputInfo[];
} {
  // Очищает текст от тэгов html, кроме <a>, <br>.
  // Заменяет символы CRLF перевода строк на html тэг <br>.
  const blockFormatted = params.blocks.map((block) => ({
    ...block,
    text: content.replaceCRLFtoBR(content.stripHtmlTags(block.text)), // Очищаем текст блока от HTML тэгов.
    imageTitle: content.stripHtmlTags(block.imageTitle), // Очищаем заголовок изображения от HTML тэгов.
  }));

  // Получаем ключи, кроме 'blocks'.
  const keys = Object.keys(params).filter((elm) => elm !== 'blocks');

  const flatData = {} as TFlatData;

  keys.forEach((key) => {
    flatData[key] = content.stripHtmlTags(String(params[key])); // Очищаем данные от HTML тэгов.
  });

  return {
    flatData,
    blockFormatted,
  };
}
