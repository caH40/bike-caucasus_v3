import { ignoreError } from './ignore';
import { parseError } from './parse';
import { LogService } from '@/services/LogService';

import { DebugMeta } from '@/types/index.interface';

/**
 * Логирует ошибку в базу данных или выводит в консоль в зависимости от среды(прод или разработка).
 * @param {unknown} error - Ошибка для обработки.
 * @param {DebugMeta} [debugMeta] - Мета данные запроса.
 * @returns {Promise<void>}
 */
export const errorLogger = async (error: unknown, debugMeta?: DebugMeta): Promise<void> => {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      // Если разработка, то выводить ошибку в консоль.
      console.error(error, debugMeta); // eslint-disable-line
      return;
    }

    // Выход, если ошибка из списка игнорируемых.
    if (ignoreError(error)) {
      return;
    }

    // логирование ошибки в БД
    const logService = new LogService();
    const errorParsed = parseError(error);
    await logService.saveError(errorParsed, debugMeta);

    // revalidatePath('/admin/logs/errors');
  } catch (error) {
    console.error(error); // eslint-disable-line
  }
};
