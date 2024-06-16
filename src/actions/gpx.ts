'use server';

import { parseGPX } from '@/libs/utils/parse-gpx';

/**
 * Серверный экшен получение распарсенных данных GPX трэка.
 * @param url - адрес gpx файла на удалённом сервере.
 */
export async function getGPSData(url: string) {
  return parseGPX(url);
}
