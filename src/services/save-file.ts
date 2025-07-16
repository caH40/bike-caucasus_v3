import { Cloud } from './cloud';
import { generateFileName } from '@/libs/utils/filename';
import { checkFileType } from '@/libs/utils/files';
import type { TSaveFile } from '@/types/index.interface';

/**
 * Сохраняет файл в облаке с уникальным суффиксом suffix и возвращает URL сохраненного файла.
 */
export async function saveFile({ file, type, suffix }: TSaveFile): Promise<string> {
  if (!file) {
    throw new Error('Не получен файл для сохранения в Облаке!');
  }

  // Проверка типа загружаемого файла на соответствие ожидаемого типа.
  checkFileType({ file, type });

  let fileName = '';

  // Создание уникального имени благодаря timestamp с добавлением расширения файла.
  fileName = generateFileName(file, suffix);

  const cloud = new Cloud();
  const { data } = await cloud.postFile({ file, fileName });
  if (!data) {
    throw new Error('Не получены данные для Url файла!');
  }

  return `https://${data.file.bucketName}.${data.file.endpointDomain}/${fileName}`;
}
