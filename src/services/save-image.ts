import { Cloud } from './cloud';
import { generateFileName } from '@/libs/utils/filename';
import type { TSaveImage } from '@/types/index.interface';

/**
 * Сохраняет изображение в облаке и возвращает URL сохраненного файла.
 */
export async function saveImage({
  fileImage,
  suffix,
  cloudName,
  domainCloudName,
  bucketName,
}: TSaveImage): Promise<string> {
  if (!fileImage) {
    throw new Error('Не получен файл изображения fileImage для сохранения в Облаке!');
  }

  let fileName = '';

  if (!fileImage.type.startsWith('image/')) {
    throw new Error(`Загружаемый файл ${fileImage.name} не является изображением`);
  }

  fileName = generateFileName(fileImage, suffix);

  const cloud = new Cloud(cloudName);
  await cloud.postFile(fileImage, bucketName, fileName);

  return `https://${bucketName}.${domainCloudName}/${fileName}`;
}
