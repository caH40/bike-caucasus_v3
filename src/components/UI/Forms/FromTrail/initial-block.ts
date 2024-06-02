import { content } from '@/libs/utils/text';

import { TBlockInputInfo } from '@/types/index.interface';
import { TBlockTrail } from '@/types/models.interface';

// Создания стартового блока, если создание новости, то blocks отсутствует,
// а при редактировании blocks передается пропсами с сервера.
export function getInitialBlocks(
  blocks?: (Omit<TBlockTrail, '_id'> & { _id: string })[]
): TBlockInputInfo[] {
  if (!blocks) {
    return [{ text: '', imageFile: null, imageTitle: '', title: '', video: '', position: 1 }];
  }

  return blocks.map((block) => {
    const editedBlock: TBlockInputInfo = {
      text: content.replaceBRtoCRLF(block.text),
      image: block.image,
      imageFile: null,
      imageOldUrl: block.image,
      imageTitle: content.stripAllHtmlTags(block.imageTitle || ''),
      position: block.position,
      title: block.title,
      video: block.video,
    };
    return editedBlock;
  });
}
