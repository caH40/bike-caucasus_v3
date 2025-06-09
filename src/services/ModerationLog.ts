import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ModeratorActionLogModel } from '@/database/mongodb/Models/ModeratorActionLog';

// types.
import { ServerResponse } from '@/types/index.interface';
import { getModeratorActionLogDto } from '@/dto/logs';
import { TGetModeratorActionLogServiceFromMongo } from '@/types/mongo.types';
import { TGetModeratorActionLogDto } from '@/types/dto.types';

/**
 * Класс работы с логированием действий модераторов.
 */
export class ModeratorActionLogService {
  private errorLogger;
  private handlerErrorDB;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

  /**
   * Получение лога по его _id
   */
  public async getById(_id: string): Promise<ServerResponse<TGetModeratorActionLogDto | null>> {
    try {
      const logDB = await ModeratorActionLogModel.findById(_id)
        .populate({ path: 'moderator', select: ['person'] })
        .lean<TGetModeratorActionLogServiceFromMongo>();

      if (!logDB) {
        throw new Error(`Не найден лог по действиям модератора с _id: ${_id}`);
      }

      const logAfterDto = getModeratorActionLogDto(logDB);

      return { data: logAfterDto, ok: true, message: 'Лог действия модератора.' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
