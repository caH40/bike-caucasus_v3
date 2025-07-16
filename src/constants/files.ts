/**
 * Типы загружаемых файлов.
 */
export const fileTypes = [
  {
    type: 'image',
    accept: '.jpg, .jpeg, .png, .webp',
    description: 'Файл изображения',
    testStrings: ['image/'],
  },
  {
    type: 'GPX',
    accept: '.gpx',
    description: 'Файл gpx-track формата GPX',
    testStrings: ['application/octet-stream', 'application/gpx+xml'],
  },
  {
    type: 'pdf',
    accept: '.pdf',
    description: 'Файл pdf',
    testStrings: ['application/pdf'],
  },
];
