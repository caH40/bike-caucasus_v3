import { Trail as TrailModel } from '@/database/mongodb/Models/Trail';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { dtoTrail, dtoTrails } from '@/dto/trail';
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
  // eslint-disable-next-line no-unused-vars
  private errorLogger: (error: unknown) => Promise<void>;
  constructor() {
    this.dbConnection = connectToMongo;
    this.errorLogger = errorLogger;
  }

  /**
   * Получить информацию о велосипедном маршруте по его идентификатору.
   *
   * @param idDB - Идентификатор маршрута в базе данных.
   * @returns Объект с данными маршрута или сообщением об ошибке.
   */
  public async getOne(idDB: string): Promise<ResponseServer<TTrailDto | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Получаем информацию о маршруте из БД.
      const trailDB: (Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser }) | null =
        await TrailModel.findOne({
          _id: idDB,
        })
          .populate({
            path: 'author',
            select: [
              'id',
              'person.firstName',
              'person.lastName',
              'provider.image',
              'imageFromProvider',
              'image',
            ],
          }) // Получаем информацию об авторе маршрута
          // .populate({ path: 'comments' }) // Нет модели/описания типов.
          .lean();

      // Если маршрут не найден, генерируем исключение.
      if (!trailDB) {
        throw new Error(`Не найден маршрут с _id:${idDB}`);
      }

      // Возвращаем информацию о маршруте и успешный статус.
      return {
        data: dtoTrail(trailDB),
        ok: true,
        message: `Данные маршрута с id${idDB}`,
      };
    } catch (error) {
      // Если произошла ошибка, логируем ее и возвращаем сообщение об ошибке.
      this.errorLogger(error);
      return handlerErrorDB(error);
    }
  }

  public async getMany(): Promise<ResponseServer<TTrailDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Получаем информацию о маршруте из БД.
      const trailsDB: (Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser })[] =
        await TrailModel.find()
          .populate({
            path: 'author',
            select: [
              'id',
              'person.firstName',
              'person.lastName',
              'provider.image',
              'imageFromProvider',
              'image',
            ],
          }) // Получаем информацию об авторе маршрута
          // .populate({ path: 'comments' }) // Нет модели/описания типов.
          .lean();

      // Возвращаем информацию о маршруте и успешный статус.
      return {
        data: dtoTrails(trailsDB),
        ok: true,
        message: 'Маршруты из БД.',
      };
    } catch (error) {
      // Если произошла ошибка, логируем ее и возвращаем сообщение об ошибке.
      this.errorLogger(error);
      return handlerErrorDB(error);
    }
  }
}
