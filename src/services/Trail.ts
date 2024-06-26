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
import type { TAuthorFromUser, TRoleModel, TTrailDocument } from '@/types/models.interface';
import type { TNewsInteractiveDto, TTrailDto } from '@/types/dto.types';
import { ErrorCustom } from './Error';
import { User } from '@/database/mongodb/Models/User';
import mongoose, { ObjectId } from 'mongoose';
import { serviceGetInteractiveToDto } from '@/dto/news';
import { Comment as CommentModel } from '@/database/mongodb/Models/Comment';

/**
 * Сервисы работы с велосипедными маршрутами.
 */
export class Trail {
  private dbConnection: () => Promise<void>;
  private errorLogger: (error: unknown) => Promise<void>; // eslint-disable-line no-unused-vars
  private handlerErrorDB: (error: unknown) => ResponseServer<null>; // eslint-disable-line no-unused-vars
  private saveFile: (params: TSaveFile) => Promise<string>; // eslint-disable-line no-unused-vars
  constructor() {
    this.dbConnection = connectToMongo;
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.saveFile = saveFile;
  }

  /**
   * Получить информацию о велосипедном маршруте по его идентификатору.
   *
   * @param idDB - Идентификатор маршрута в базе данных.
   * @returns Объект с данными маршрута или сообщением об ошибке.
   */
  public async getOne(
    urlSlug: string,
    idUserDB: string | undefined
  ): Promise<ResponseServer<TTrailDto | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Получаем информацию о маршруте из БД.
      const trailDB:
        | (Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser } & {
            isLikedByUser: boolean;
            commentsCount: number;
          })
        | null = await TrailModel.findOne({
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

      if (idUserDB) {
        trailDB.isLikedByUser = trailDB.likedBy.some((like) => String(like) === idUserDB);
      }

      const commentsDB = await CommentModel.find({
        document: { _id: String(trailDB._id), type: 'trail' },
      });
      trailDB.commentsCount = commentsDB.length;

      // Возвращаем информацию о маршруте и успешный статус.
      return {
        data: dtoTrail(trailDB),
        ok: true,
        message: `Данные маршрута с urlSlug:${urlSlug}`,
      };
    } catch (error) {
      // Если произошла ошибка, логируем ее и возвращаем сообщение об ошибке.
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Удаление Маршрута.
   * @param urlSlug - Последняя часть url страницы с маршрутом
   */
  public async delete({
    urlSlug,
    idUserDB,
  }: {
    urlSlug: string;
    idUserDB: string | undefined;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      this.dbConnection();

      const userDB: { role: TRoleModel; id: number } | null = await User.findOne(
        { _id: idUserDB },
        { role: true, id: true, _id: false }
      )
        .populate('role')
        .lean();

      if (!userDB) {
        throw new Error(`Не найден пользователь с _id:${userDB}`);
      }

      // Проверка есть ли такой Маршрут в БД.
      const trailDBForDelete: TTrailDocument | null = await TrailModel.findOne({ urlSlug });
      if (!trailDBForDelete) {
        throw new Error(`Маршрут с urlSlug:${urlSlug} не найден в БД`);
      }

      let query = {} as { urlSlug: string; 'author._id'?: string };
      // Модератор с правами на удаление маршрута может удалить любой маршрут.
      if (
        userDB.role.permissions.some((permission) =>
          ['moderation.trail.delete', 'all'].includes(permission)
        )
      ) {
        query = { urlSlug };
      } else {
        // Пользователь может удалить только свой маршрут.
        query = { urlSlug, 'author._id': idUserDB };
      }
      const commentDB = await TrailModel.findOneAndDelete(query);

      // Если Пользователь не является автором маршрута, или модератор-пользователь у которого нет
      // прав на удаление маршрутов, отсутствует permissions - moderation.trail.delete то проброс исключения!
      if (!commentDB) {
        throw new Error(
          `У вас нет прав на удаление маршрута с urlSlug:${urlSlug}. Запрос от пользователя bcId:${userDB.id}`
        );
      }

      return {
        data: null,
        ok: true,
        message: `Маршрут удалён!`,
      };
    } catch (error) {
      this.errorLogger(error); // логирование
      return this.handlerErrorDB(error);
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

  public async getMany({
    bikeType,
    region,
    difficultyLevel,
    idUserDB,
  }: {
    bikeType?: string | null;
    region?: string | null;
    difficultyLevel?: string | null;
    idUserDB?: string;
  }): Promise<ResponseServer<TTrailDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const query = {} as { bikeType?: string; region?: string; difficultyLevel?: string };
      if (bikeType) {
        query.bikeType = bikeType;
      }
      if (region) {
        query.region = region;
      }
      if (difficultyLevel) {
        query.difficultyLevel = difficultyLevel;
      }

      // Получаем информацию о маршруте из БД.
      const trailsDB: (Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser } & {
        isLikedByUser: boolean;
        commentsCount: number;
      })[] = await TrailModel.find(query)
        .populate({
          path: 'author',
          select: [
            'id',
            'likedBy',
            'person.firstName',
            'person.lastName',
            'provider.image',
            'imageFromProvider',
            'image',
          ],
        }) // Получаем информацию об авторе маршрута
        // .populate({ path: 'comments' }) // Нет модели/описания типов.
        .lean();

      if (idUserDB) {
        trailsDB.forEach((trail) => {
          trail.isLikedByUser = trail.likedBy.some((like) => String(like) === idUserDB);
          trail.likedBy = [];
        });
      }

      for (const trail of trailsDB) {
        const commentsDB = await CommentModel.find({
          document: { _id: String(trail._id), type: 'trail' },
        });
        trail.commentsCount = commentsDB.length;
      }

      // Возвращаем информацию о маршруте и успешный статус.
      return {
        data: dtoTrails(trailsDB),
        ok: true,
        message: 'Маршруты из БД.',
      };
    } catch (error) {
      // Если произошла ошибка, логируем ее и возвращаем сообщение об ошибке.
      this.errorLogger(error);
      return this.handlerErrorDB(error);
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

  /**
   * Обрабатывает лайк или снятие лайка Маршрута пользователем.
   * @param {Object} params - Объект с параметрами.
   * @param {string} params.idUserDB - Идентификатор пользователя в базе данных.
   * @param {string} params.idNews - Идентификатор новости в базе данных.
   * @returns {Promise<ResponseServer<any>>} - Результат операции учета лайка.
   */
  public async countLike({
    idUserDB,
    idTrail,
  }: {
    idUserDB: string;
    idTrail: string;
  }): Promise<ResponseServer<any>> {
    try {
      // Подключение к БД.
      this.dbConnection();

      // Проверка существует ли пользователь в БД с таким ID (может лишняя проверка)?
      const userDB = await User.findOne({ _id: idUserDB });
      if (!userDB) {
        throw new Error(`Не найден пользователь с _id:${userDB}`);
      }

      const trailDB: TTrailDocument | null = await TrailModel.findOne({ _id: idTrail });
      if (!trailDB) {
        throw new Error(`Маршрут не найден с _id:${idTrail}`);
      }

      const idUserDBObj = new mongoose.Types.ObjectId(idUserDB);

      if (trailDB.likedBy.includes(idUserDBObj)) {
        const userIndex = trailDB.likedBy.indexOf(idUserDBObj);
        trailDB.likedBy.splice(userIndex, 1);
        trailDB.count.likes = trailDB.likedBy.length;
      } else {
        trailDB.likedBy.push(idUserDBObj);
        trailDB.count.likes = trailDB.likedBy.length;
      }

      await trailDB.save();

      return {
        data: null,
        ok: true,
        message: `Учет лайка от пользователя _id:${idUserDB}`,
      };
    } catch (error) {
      this.errorLogger(error); // логирование
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Сервис получения данных для интерактивного блока маршрута idTrail.
   */
  public async getInteractive({
    idTrail,
    idUserDB,
  }: {
    idTrail: string;
    idUserDB: string | undefined;
  }): Promise<ResponseServer<null | TNewsInteractiveDto>> {
    try {
      // Подключение к БД.
      this.dbConnection();

      const trailDB: {
        count: {
          views: number;
          likes: number;
          shares: number;
        };
        likedBy: ObjectId[];
      } | null = await TrailModel.findOne(
        { _id: idTrail },
        { count: true, likedBy: true }
      ).lean();

      if (!trailDB) {
        throw new Error(`Не найдена запрашиваемая новость с _id:${idTrail}`);
      }

      // isLikedByUser поставил или нет пользователь лайк данной новости
      const isLikedByUser = trailDB.likedBy.some((like) => String(like) === idUserDB);

      const commentsDB = await CommentModel.find({ document: { _id: idTrail, type: 'trail' } });
      const commentsCount = commentsDB.length;

      return {
        data: serviceGetInteractiveToDto(
          { viewsCount: trailDB.count.views, likesCount: trailDB.count.likes },
          isLikedByUser,
          commentsCount
        ),
        ok: true,
        message: `Запрашиваемый маршрут с _id:${idTrail}`,
      };
    } catch (error) {
      this.errorLogger(error); // логирование
      return this.handlerErrorDB(error);
    }
  }
}
