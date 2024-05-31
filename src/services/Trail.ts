import { TrailModel } from '@/database/mongodb/Models/Trail';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { dtoTrail } from '@/dto/trail';
import { errorLogger } from '@/errors/error';
import { TTrailDto } from '@/types/dto.types';
import type { ResponseServer } from '@/types/index.interface';
import type { TAuthorFromUser, TTrailDocument } from '@/types/models.interface';
import { handlerErrorDB } from './mongodb/error';

/**
 * Сервисы работы с велосипедными маршрутами.
 */
export class Trail {
  private dbConnection: () => Promise<void>;
  constructor() {
    this.dbConnection = connectToMongo;
  }
  public async getOne(idDB: string): Promise<ResponseServer<TTrailDto | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const trailDB: (Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser }) | null =
        await TrailModel.findOne({
          _id: idDB,
        })
          .populate({ path: 'author' })
          .populate({ path: 'comments' }) // Нет модели/описания типов.
          .lean();

      if (!trailDB) {
        throw new Error(`Не найден маршрут с _id:${idDB}`);
      }

      return {
        data: dtoTrail(trailDB),
        ok: true,
        message: `Данные маршрута с id${idDB}`,
      };
    } catch (error) {
      errorLogger(error);
      return handlerErrorDB(error);
    }
  }
}
