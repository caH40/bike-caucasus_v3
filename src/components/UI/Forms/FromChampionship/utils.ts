// Небольшие утилиты для компоненты FormChampionship

import { content } from '@/libs/utils/text';

type Params = {
  name: string;
  description: string;
};

/**
 * Очищает тексты Чемпионата от тэгов html, кроме <a>, <br>.
 * Заменяет символы CRLF перевода строк на html тэг <br>.
 */
export function formateAndStripContent({ name, description }: Params) {
  const nameStripedHtmlTags = content.stripHtmlTags(name);
  const descriptionStripedHtmlTags = content.replaceCRLFtoBR(
    content.stripHtmlTags(description)
  );

  return {
    nameStripedHtmlTags,
    descriptionStripedHtmlTags,
  };
}
