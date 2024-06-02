import { content } from '@/libs/utils/text';
import { TNewsBlockDto } from '@/types/dto.types';
import { TBlockInputInfo } from '@/types/index.interface';

// Создания стартового блока, если создание новости, то blocks отсутствует,
// а при редактировании blocks передается пропсами с сервера.
export function getInitialBlocks(blocks?: TNewsBlockDto[]): TBlockInputInfo[] {
  if (!blocks) {
    return [{ text: '', image: null, imageFile: null, imageTitle: '', position: 1 }];
  }

  return blocks.map((block) => {
    const editedBlock: TBlockInputInfo = {
      text: content.replaceBRtoCRLF(block.text),
      image: block.image,
      imageFile: null,
      imageOldUrl: block.image,
      imageTitle: content.stripAllHtmlTags(block.imageTitle),
      position: block.position,
    };
    return editedBlock;
  });
}
