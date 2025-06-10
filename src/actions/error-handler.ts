'use server';

import { LogService } from '@/services/LogService';
import type { TLogsErrorParsed } from '@/types/index.interface';

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
      const logService = new LogService();
      await logService.saveError(errorParsed);
    }
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
}
