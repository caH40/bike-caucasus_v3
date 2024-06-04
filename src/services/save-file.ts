import { Cloud } from './cloud';
import { fileTypes } from '@/constants/files';
import { generateFileName } from '@/libs/utils/filename';
import type { TSaveFile } from '@/types/index.interface';

/**
 * Сохраняет файл в облаке с уникальным суффиксом suffix и возвращает URL сохраненного файла.
 */
export async function saveFile({
  file,
  type,
  suffix,
  cloudName,
  domainCloudName,
  bucketName,
}: TSaveFile): Promise<string> {
  if (!file) {
    throw new Error('Не получен файл для сохранения в Облаке!');
  }

  const typeCurrent = fileTypes.find((elm) => elm.type === type);
  if (!typeCurrent) {
    throw new Error('Не получен или неправильно задан тип файла!');
  }

  let fileName = '';

  if (!file.type.startsWith(typeCurrent.testString)) {
    throw new Error(`Загружаемый файл ${file.name} не является ${typeCurrent.description}`);
  }

  fileName = generateFileName(file, suffix);

  const cloud = new Cloud(cloudName);
  await cloud.postFile(file, bucketName, fileName);

  return `https://${bucketName}.${domainCloudName}/${fileName}`;
}
