import { ErrorCustom } from '@/services/Error';
import { ignoreList } from './ignore-list';

/**
 * Проверяет, следует ли игнорировать ошибку на основе списка игнорируемых сообщений об ошибках.
 * @param {unknown} error - Ошибка, которую необходимо проверить.
 * @returns {boolean} - Возвращает true, если сообщение об ошибке находится в списке игнорируемых, иначе false.
 */
export const ignoreError = (error: unknown): boolean => {
  // Проверка, является ли ошибка экземпляром класса Error.
  if (error instanceof ErrorCustom) {
    // Возвращает true, если сообщение об ошибке находится в списке игнорируемых сообщений.
    return ignoreList.includes(error.statusCode);
  }

  // Если ошибка не является экземпляром класса ErrorCustom, возвращаем false.
  return false;
};
