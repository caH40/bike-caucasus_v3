'use server';

import type { TLogsErrorParsed } from '@/types/index.interface';
import { Logger } from '../logger';

/**
 * Серверный экшен обработки ошибок на клиентской стороне.
 */
export async function errorHandlerClient(errorParsed: TLogsErrorParsed): Promise<void> {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
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
