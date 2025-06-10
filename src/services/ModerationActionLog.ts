import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ModeratorActionLogModel } from '@/database/mongodb/Models/ModeratorActionLog';
import { getByIdModeratorActionLogDto } from '@/dto/logs';

// types.
import {
  ServerResponse,
  TCreateModeratorActionLogServiceParams,
} from '@/types/index.interface';

import { TGetByIdModeratorActionLogDto } from '@/types/dto.types';
import { TGetByIdModeratorActionLogFromMongo } from '@/types/mongo.types';

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
  public async getById(
    _id: string
  ): Promise<ServerResponse<TGetByIdModeratorActionLogDto | null>> {
    try {
      const logDB = await ModeratorActionLogModel.findById(_id)
        .populate({ path: 'moderator', select: ['person'] })
        .lean<TGetByIdModeratorActionLogFromMongo>();

      if (!logDB) {
        throw new Error(`Не найден лог по действиям модератора с _id: ${_id}`);
      }

      const logAfterDto = getByIdModeratorActionLogDto(logDB);

      return { data: logAfterDto, ok: true, message: 'Лог действия модератора.' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Логирование действия модератора.
   */
  public static async create({
    moderator,
    action,
    client,
    entity,
    changes,
    entityIds,
  }: TCreateModeratorActionLogServiceParams): Promise<void> {
    try {
      await ModeratorActionLogModel.create({
        moderator,
        action,
        client,
        entityIds,
        entity,
        changes,
        timestamp: new Date(),
      });
    } catch (error) {
      errorLogger(error);
    }
  }
}
