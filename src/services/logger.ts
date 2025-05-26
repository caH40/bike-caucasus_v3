import { LogsError } from '@/database/mongodb/Models/LogsError';

import { serviceGetErrorDto, serviceGetErrorsDto } from '@/dto/logs';
import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import type { TGetErrorsDto } from '@/types/dto.types';
import type { ServerResponse, TLogsErrorParsed } from '@/types/index.interface';
import type { TLogsErrorModel } from '@/types/models.interface';

/**
 * Класс работы с логами.
 */
export class Logger {
  constructor() {}

  public async saveError(error: TLogsErrorParsed) {
    try {
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
  public async getErrors(): Promise<ServerResponse<TGetErrorsDto[] | null>> {
    try {
      const logsDB = await LogsError.find().lean<TLogsErrorModel[]>();
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
  public async getError(_id: string): Promise<ServerResponse<TGetErrorsDto | null>> {
    try {
      const logDB = await LogsError.findOne({ _id }).lean<TLogsErrorModel>();

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
