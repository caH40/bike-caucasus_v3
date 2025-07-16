import { fileTypes } from '@/constants/files';

type Params = {
  file: File;
  type: 'image' | 'GPX' | 'pdf';
};

/**
 * Проверка типа загружаемого файла с ожидаемым.
 */
export function checkFileType({ file, type }: Params): void {
  const typeEntry = fileTypes.find((entry) => entry.type === type);

  if (!typeEntry) {
    throw new Error('Не получен или неправильно задан тип файла!');
  }

  const matched = typeEntry.testStrings.some((mime) => file.type.startsWith(mime));

  if (!matched) {
    throw new Error(`Загружаемый файл ${file.name} не является ${typeEntry.description}`);
  }
}
