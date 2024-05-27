'use server';

import { Logger } from '../logger';
import type { TLogsErrorModel } from '@/types/models.interface';

/**
 * Серверный экшен обработки ошибок на клиентской стороне.
 */
export async function errorHandlerClient(
  errorParsed: Omit<TLogsErrorModel, 'timestamp'>
): Promise<void> {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment) {
      // если разработка, то выводить ошибку в консоль
      console.log(errorParsed); // eslint-disable-line
    } else {
      // логирование ошибки в БД
      const logger = new Logger();
      await logger.saveError(errorParsed);
    }
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
}
