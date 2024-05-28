import { revalidatePath } from 'next/cache';
import { ignoreError } from './ignore';
import { parseError } from './parse';
import { Logger } from '@/services/logger';

/**
 * Логирует ошибку в базу данных или выводит в консоль в зависимости от среды(прод или разработка).
 * @param {unknown} error - Ошибка для обработки.
 * @returns {Promise<void>}
 */
export const errorLogger = async (error: unknown): Promise<void> => {
  try {
    // Выход, если ошибка из списка игнорируемых.
    if (ignoreError(error)) {
      return;
    }

    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!isDevelopment) {
      // Если разработка, то выводить ошибку в консоль.
      console.error(error); // eslint-disable-line
    } else {
      // логирование ошибки в БД
      const logger = new Logger();
      const errorParsed = parseError(error);
      await logger.saveError(errorParsed);

      revalidatePath('/admin/logs/errors');
    }
  } catch (error) {
    console.error(error); // eslint-disable-line
  }
};
