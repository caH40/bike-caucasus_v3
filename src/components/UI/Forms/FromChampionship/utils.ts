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

/**
 * Условие отображения блока выбора родительского Чемпионата для серии.
 */
export function shouldShowTrackInput({
  typeInInput,
  typeInDB,
  isCreatingForm,
}: {
  typeInInput: string | undefined;
  typeInDB: string | undefined;
  isCreatingForm: boolean;
}) {
  const isStageOrSingle = typeInDB && ['single', 'stage'].includes(typeInDB);
  const inputUndefined = typeof typeInInput === 'undefined';

  return (
    (isCreatingForm && inputUndefined) ||
    (isStageOrSingle && inputUndefined) ||
    ['single', 'stage'].includes(String(typeInInput))
  );
}
