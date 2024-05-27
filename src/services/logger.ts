import { LogsError } from '@/database/mongodb/Models/LogsError';
import { connectToMongo } from '@/database/mongodb/mongoose';
import type { TLogsErrorModel } from '@/types/models.interface';

/**
 * Класс работы с логами.
 */
export class Logger {
  private dbConnection: () => Promise<void>;
  constructor() {
    this.dbConnection = connectToMongo;
  }

  public async saveError(error: Omit<TLogsErrorModel, 'timestamp'>) {
    try {
      await this.dbConnection();
      const response = await LogsError.create({ ...error, timestamp: Date.now() });
      if (!response) {
        throw new Error('Ошибка при сохранении лога в БД');
      }
    } catch (error) {
      console.log('Ошибка в методе saveError записи лога:', error); // eslint-disable-line
    }
  }
}
