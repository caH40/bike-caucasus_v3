/**
 * Типы загружаемых файлов.
 */
export const fileTypes = [
  {
    type: 'image',
    accept: '.jpg, .jpeg, .png, .webp',
    description: 'Файл изображения',
    testString: 'image/',
  },
  {
    type: 'GPX',
    accept: '.gpx',
    description: 'Файл gpx-track формата GPX',
    testString: 'application/octet-stream',
  },
  {
    type: 'pdf',
    accept: '.pdf',
    description: 'Файл pdf',
    testString: 'application/pdf',
  },
];
