import { parseString } from 'xml2js';

import type { GPX } from '@/types/index.interface';

/**
 * Парсит GPX трэк  формате xml.
 * @param url - Ссылка на gpx трэк на удаленном сервере.
 * @returns
 */
export async function parseGPX(input: string): Promise<GPX> {
  let data: string = '';

  // Проверка, является ли входной параметр URL.
  if (input.startsWith('http://') || input.startsWith('https://')) {
    try {
      const res = await fetch(input);

      if (!res.ok) {
        throw new Error('Ошибка fetch!');
      }

      data = await res.text();
    } catch (error) {
      throw error;
    }
  } else {
    // Если это не URL, предполагаем, что это строка с данными GPX.
    data = input;
  }

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
