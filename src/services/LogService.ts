import { LogsError } from '@/database/mongodb/Models/LogsError';

import { getModeratorActionLogDto, serviceGetErrorDto, serviceGetErrorsDto } from '@/dto/logs';
import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ModeratorActionLogModel } from '@/database/mongodb/Models/ModeratorActionLog';

// types
import type { TGetErrorsDto, TGetModeratorActionLogDto } from '@/types/dto.types';
import type { DebugMeta, ServerResponse, TLogsErrorParsed } from '@/types/index.interface';
import type { TLogsErrorModel } from '@/types/models.interface';
import { TGetAllModeratorActionLogsFromMongo } from '@/types/mongo.types';

/**
 * Класс работы с логами.
 */
export class LogService {
  constructor() {}

  public async saveError(error: TLogsErrorParsed, debugMeta?: DebugMeta) {
    try {
      const response = await LogsError.create({ ...error, debugMeta });
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

  /**
   * Получение логов действий модераторов.
   */
  public async getAllModeratorActions(): Promise<
    ServerResponse<TGetModeratorActionLogDto[] | null>
  > {
    try {
      const logsDB = await ModeratorActionLogModel.find()
        .populate({
          path: 'moderator',
          select: [
            'person.firstName',
            'person.lastName',
            'image',
            'imageFromProvider',
            'provider.image',
            'role',
          ],
          populate: { path: 'role', select: ['-_id', 'name'] },
        })
        .lean<TGetAllModeratorActionLogsFromMongo[]>();

      // Сортировка по убыванию даты создания лога (сначала свежие).
      logsDB.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      const logsAfterDto = logsDB.map((log) => getModeratorActionLogDto(log));

      return {
        data: logsAfterDto,
        ok: true,
        message: `Логи всех действий модераторов.`,
      };
    } catch (error) {
      errorLogger(error);
      return handlerErrorDB(error);
    }
  }

  /**
   * Получение лога действия модератора.
   */
  public async getModeratorAction(
    logId: string
  ): Promise<ServerResponse<TGetModeratorActionLogDto | null>> {
    try {
      const logDB = await ModeratorActionLogModel.findById(logId)
        .populate({
          path: 'moderator',
          select: [
            'person.firstName',
            'person.lastName',
            'image',
            'imageFromProvider',
            'provider.image',
            'role',
          ],
          populate: { path: 'role', select: ['-_id', 'name'] },
        })
        .lean<TGetAllModeratorActionLogsFromMongo>();

      if (!logDB) {
        throw new Error(`Не найден лог с _id: ${logId}`);
      }

      const logsAfterDto = getModeratorActionLogDto(logDB);

      return {
        data: logsAfterDto,
        ok: true,
        message: `Логи всех действий модераторов.`,
      };
    } catch (error) {
      errorLogger(error);
      return handlerErrorDB(error);
    }
  }
}
