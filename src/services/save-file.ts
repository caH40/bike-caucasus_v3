import { Cloud } from './cloud';
import { fileTypes } from '@/constants/files';
import { generateFileName } from '@/libs/utils/filename';
import type { TSaveFile } from '@/types/index.interface';

/**
 * Сохраняет файл в облаке с уникальным суффиксом suffix и возвращает URL сохраненного файла.
 */
export async function saveFile({ file, type, suffix }: TSaveFile): Promise<string> {
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

  // Создание уникального имени благодаря timestamp с добавлением расширения файла.
  fileName = generateFileName(file, suffix);

  const cloud = new Cloud();
  const { data } = await cloud.postFile({ file, fileName });
  if (!data) {
    throw new Error('Не получены данные для Url файла!');
  }

  return `https://${data.file.bucketName}.${data.file.endpointDomain}/${fileName}`;
}
