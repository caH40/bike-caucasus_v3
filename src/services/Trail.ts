import slugify from 'slugify';

import { Trail as TrailModel } from '@/database/mongodb/Models/Trail';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { dtoTrail, dtoTrails } from '@/dto/trail';
import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { deserializeTrailCreate } from '@/libs/utils/deserialization/trail';
import { saveFile } from './save-file';
import { getHashtags } from '@/libs/utils/text';
import { getNextSequenceValue } from './sequence';
import type { ResponseServer, TCloudConnect, TSaveFile } from '@/types/index.interface';
import type { TAuthorFromUser, TTrailDocument } from '@/types/models.interface';
import type { TTrailDto } from '@/types/dto.types';
import { ErrorCustom } from './Error';

/**
 * Сервисы работы с велосипедными маршрутами.
 */
export class Trail {
  private dbConnection: () => Promise<void>;
  private errorLogger: (error: unknown) => Promise<void>; // eslint-disable-line no-unused-vars
  private saveFile: (params: TSaveFile) => Promise<string>; // eslint-disable-line no-unused-vars
  constructor() {
    this.dbConnection = connectToMongo;
    this.errorLogger = errorLogger;
    this.saveFile = saveFile;
  }

  /**
   * Получить информацию о велосипедном маршруте по его идентификатору.
   *
   * @param idDB - Идентификатор маршрута в базе данных.
   * @returns Объект с данными маршрута или сообщением об ошибке.
   */
  public async getOne(urlSlug: string): Promise<ResponseServer<TTrailDto | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Получаем информацию о маршруте из БД.
      const trailDB: (Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser }) | null =
        await TrailModel.findOne({
          urlSlug,
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
        throw new ErrorCustom(`Не найден маршрут с urlSlug:${urlSlug}`, 404);
      }

      // Возвращаем информацию о маршруте и успешный статус.
      return {
        data: dtoTrail(trailDB),
        ok: true,
        message: `Данные маршрута с urlSlug:${urlSlug}`,
      };
    } catch (error) {
      // Если произошла ошибка, логируем ее и возвращаем сообщение об ошибке.
      this.errorLogger(error);
      return handlerErrorDB(error);
    }
  }

  /**
   * Подсчет просмотров Маршрута.
   * @param urlSlug - Последняя часть url страницы с маршрутом
   */
  public async countView(urlSlug: string): Promise<void> {
    try {
      await TrailModel.findOneAndUpdate<TTrailDocument>(
        { urlSlug },
        { $inc: { 'count.views': 1 } }
      );
    } catch (error) {
      errorLogger(error);
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

  /**
   * Создание нового маршрута (trail).
   */
  public async post(
    formData: FormData,
    { cloudName, bucketName, domainCloudName }: TCloudConnect,
    author: string
  ): Promise<ResponseServer<null>> {
    // Подключение к БД.
    await this.dbConnection();

    // Десериализация данных, полученных с клиента.
    const trail = deserializeTrailCreate(formData);

    const suffixTrack = 'trail_track_gpx-';
    // Сохранение файла трэка.
    const trackGPX = await this.saveFile({
      file: trail.track as File,
      type: 'GPX',
      suffix: suffixTrack,
      cloudName,
      domainCloudName,
      bucketName,
    });

    const suffixImage = 'trail_image_poster-';
    // Сохранение изображения для Постера маршрута.
    const poster = await this.saveFile({
      file: trail.poster as File,
      type: 'image',
      suffix: suffixImage,
      cloudName,
      domainCloudName,
      bucketName,
    });

    // Сохранение изображений из текстовых блоков.
    let index = -1;
    for (const block of trail.blocks) {
      index++;

      // Если нет файла, то следующая итерация блоков.
      if (!block.imageFile) {
        continue;
      }

      // Вызов метода сохранения файла изображения.
      const urlSaved = await this.saveFile({
        file: block.imageFile,
        type: 'image',
        suffix: suffixImage,
        cloudName,
        domainCloudName,
        bucketName,
      });

      trail.blocks[index].image = urlSaved;
    }

    // Замена строки на массив хэштегов.
    const hashtags = getHashtags(trail.hashtags);

    // Создание slug из title для url страницы маршрута.
    const sequenceValue = await getNextSequenceValue('trail');
    const stringRaw = `${sequenceValue}-${trail.region}-${trail.title}`;
    const urlSlug = slugify(stringRaw, { lower: true, strict: true });

    // Подключение к БД.
    await this.dbConnection();

    const response = await TrailModel.create({
      ...trail,
      hashtags,
      poster,
      author,
      urlSlug,
      trackGPX,
    });

    if (!response._id) {
      throw new Error('Маршрут не сохранился в БД!');
    }

    return { data: null, ok: true, message: 'Маршрут сохранен в БД!' };
  }
}
