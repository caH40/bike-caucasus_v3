import { parseString } from 'xml2js';

import type { GPX } from '@/types/index.interface';

/**
 * Парсит GPX трэк  формате xml.
 * @param url - Ссылка на gpx трэк на удаленном сервере.
 * @returns
 */
export async function parseGPX(url: string): Promise<GPX> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Ошибка fetch!');
  }

  const data = await res.text();
  // Парсинг XML с помощью xml2js
  return new Promise((resolve, reject) => {
    parseString(data, {}, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result as GPX);
      }
    });
  });
}
