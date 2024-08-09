/**
 * Создает имя файла для сохранения в облаке.
 * @returns название файла {suffix}{Date}.{extension}
 */
export function generateFileName(file: File, suffix: string): string {
  const fileName = suffix + Date.now();
  const extension = file.name.split('.').pop();
  return `${fileName}.${extension}`;
}
