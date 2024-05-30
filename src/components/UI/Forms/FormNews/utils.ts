// Небольшие утилиты для компоненты FormNewsCreate

import { content } from '@/libs/utils/text';
import type { TNewsBlocksEdit } from '@/types/index.interface';

type Params = {
  title: string;
  subTitle: string;
  hashtags: string;
  blocks: TNewsBlocksEdit[];
};

// Очищает тексты Новости от тэгов html, кроме <a>, <br>.
// Заменяет символы CRLF перевода строк на html тэг <br>.
export function formateAndStripContent({ title, subTitle, hashtags, blocks }: Params) {
  // Очищает текст от тэгов html, кроме <a>, <br>.
  // Заменяет символы CRLF перевода строк на html тэг <br>.
  const blockFormatted = blocks.map((block) => ({
    ...block,
    text: content.replaceCRLFtoBR(content.stripHtmlTags(block.text)),
    imageTitle: content.stripHtmlTags(block.imageTitle),
  }));

  const titleStripedHtmlTags = content.stripHtmlTags(title);
  const subTitleStripedHtmlTags = content.stripHtmlTags(subTitle);
  const hashtagsStripedHtmlTags = content.stripHtmlTags(hashtags);

  return {
    blockFormatted,
    titleStripedHtmlTags,
    subTitleStripedHtmlTags,
    hashtagsStripedHtmlTags,
  };
}
