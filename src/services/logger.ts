import { LogsError } from '@/database/mongodb/Models/LogsError';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { serviceGetErrorDto, serviceGetErrorsDto } from '@/dto/logs';
import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import type { TGetErrorsDto } from '@/types/dto.types';
import type { ResponseServer, TLogsErrorParsed } from '@/types/index.interface';
import type { TLogsErrorModel } from '@/types/models.interface';

/**
 * Класс работы с логами.
 */
export class Logger {
  private dbConnection: () => Promise<void>;
  constructor() {
    this.dbConnection = connectToMongo;
  }

  public async saveError(error: TLogsErrorParsed) {
    try {
      await this.dbConnection();
      const response = await LogsError.create({ ...error });
      if (!response) {
        throw new Error('Ошибка при сохранении лога в БД');
      }
    } catch (error) {
      console.error('Ошибка в методе saveError записи лога:', error); // eslint-disable-line
    }
  }

  /**
   * Получение логов ошибок.
   */
  public async getErrors(): Promise<ResponseServer<TGetErrorsDto[] | null>> {
    try {
      await this.dbConnection();
      const logsDB: TLogsErrorModel[] = await LogsError.find().lean();
      logsDB.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        data: serviceGetErrorsDto(logsDB),
        ok: true,
        message: `Логи ошибок.`,
      };
    } catch (error) {
      errorLogger(error);
      return handlerErrorDB(error);
    }
  }

  /**
   * Получение лога ошибки.
   */
  public async getError(_id: string): Promise<ResponseServer<TGetErrorsDto | null>> {
    try {
      await this.dbConnection();
      const logDB: TLogsErrorModel | null = await LogsError.findOne({ _id }).lean();

      if (!logDB) {
        throw new Error(`Лог ошибки с _id:${_id} не найден!`);
      }

      return {
        data: serviceGetErrorDto(logDB),
        ok: true,
        message: `Логи ошибок.`,
      };
    } catch (error) {
      errorLogger(error);
      return handlerErrorDB(error);
    }
  }
}
