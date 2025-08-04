import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';

import { Trail as TrailModel } from '@/database/mongodb/Models/Trail';

import { dtoTrail, dtoTrails } from '@/dto/trail';
import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { deserializeTrailCreate } from '@/libs/utils/deserialization/trail';
import { saveFile } from './save-file';
import { getHashtags } from '@/libs/utils/text';
import { getNextSequenceValue } from './sequence';
import type {
  DebugMeta,
  ServerResponse,
  TClientMeta,
  TSaveFile,
  TServiceEntity,
  TTrailCreateFromClient,
} from '@/types/index.interface';
import type { TAuthorFromUser, TTrailDocument } from '@/types/models.interface';
import type { TNewsInteractiveDto, TTrailDto } from '@/types/dto.types';
import { ErrorCustom } from './Error';
import { User } from '@/database/mongodb/Models/User';
import { serviceGetInteractiveToDto } from '@/dto/news';
import { Comment as CommentModel } from '@/database/mongodb/Models/Comment';
// import { millisecondsIn3Days } from '@/constants/date';
import { Cloud } from './cloud';
import { fileNameFormUrl } from '@/constants/regex';
import { ModeratorActionLogService } from './ModerationActionLog';

/**
 * Сервисы работы с велосипедными маршрутами.
 */
export class Trail {
  private errorLogger: (error: unknown, debugMeta?: DebugMeta) => Promise<void>;
  private handlerErrorDB: (error: unknown) => ServerResponse<null>; // eslint-disable-line no-unused-vars
  private saveFile: (params: TSaveFile) => Promise<string>; // eslint-disable-line no-unused-vars
  private entity: TServiceEntity;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.saveFile = saveFile;
    this.entity = 'trail';
  }

  /**
   * Получить информацию о велосипедном маршруте по его идентификатору.
   *
   * @param idDB - Идентификатор маршрута в базе данных.
   * @returns Объект с данными маршрута или сообщением об ошибке.
   */
  public async getOne({
    urlSlug,
    idUserDB,
    debugMeta,
  }: {
    urlSlug: string;
    idUserDB: string | undefined;
    debugMeta?: DebugMeta;
  }): Promise<ServerResponse<TTrailDto | null>> {
    try {
      // Получаем информацию о маршруте из БД.
      const trailDB = await TrailModel.findOne({
        urlSlug,
      })
        .populate({
          path: 'author',
          select: [
            'id',
            'person.firstName',
            'person.lastName',
            'person.patronymic',
            'provider.image',
            'imageFromProvider',
            'image',
          ],
        }) // Получаем информацию об авторе маршрута
        // .populate({ path: 'comments' }) // Нет модели/описания типов.
        .lean<
          Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser } & {
            isLikedByUser: boolean;
            commentsCount: number;
          }
        >();

      // Если маршрут не найден, генерируем исключение.
      if (!trailDB) {
        throw new ErrorCustom(`Не найден маршрут с urlSlug:${urlSlug}`, 404);
      }

      if (idUserDB) {
        trailDB.isLikedByUser = trailDB.likedBy.some((like) => String(like) === idUserDB);
      }

      trailDB.likedBy = []; // Не нужны на клиенте Id тех кто лайкал.

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
      this.errorLogger(error, debugMeta);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Удаление Маршрута.
   * @param urlSlug - Последняя часть url страницы с маршрутом
   */
  public async delete({
    urlSlug,
    moderator,
    client,
  }: {
    urlSlug: string;
    moderator: string;
    client: TClientMeta;
  }): Promise<ServerResponse<null>> {
    try {
      // Проверка есть ли такой Маршрут в БД.
      const trailDBForDelete: TTrailDocument | null = await TrailModel.findOne({ urlSlug });
      if (!trailDBForDelete) {
        throw new Error(`Маршрут с urlSlug:${urlSlug} не найден в БД`);
      }

      // Экземпляр сервиса работы с Облаком
      const cloud = new Cloud();
      // Удаление всех файлов новости с Облака.
      await cloud.deleteFile({
        prefix: trailDBForDelete.poster.replace(fileNameFormUrl, '$1'),
      });
      await cloud.deleteFile({
        prefix: trailDBForDelete.trackGPX.replace(fileNameFormUrl, '$1'),
      });
      for (const block of trailDBForDelete.blocks) {
        if (block.image) {
          await cloud.deleteFile({ prefix: block.image.replace(fileNameFormUrl, '$1') });
        }
      }

      const newsDeleted: { acknowledged: boolean; deletedCount: number } =
        await trailDBForDelete.deleteOne();

      if (!newsDeleted.acknowledged || newsDeleted.deletedCount === 0) {
        throw new Error('Ошибка при удалении маршрута с БД!');
      }

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator,
        changes: {
          description: `Удаление маршрута: "${trailDBForDelete.title}"`,
          params: {
            urlSlug,
            moderator,
          },
        },
        action: 'delete',
        entity: this.entity,
        entityIds: [trailDBForDelete._id.toString()],
        client,
      });

      return {
        data: null,
        ok: true,
        message: 'Маршрут удалён!',
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
    search,
  }: {
    bikeType?: string | null;
    region?: string | null;
    difficultyLevel?: string | null;
    idUserDB?: string;
    search?: string; // Ключевое слово по которому происходит поиск маршрутов.
  }): Promise<ServerResponse<TTrailDto[] | null>> {
    try {
      // Формирование строки для запроса маршрутов из БД.
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

      // Регулярное выражение для поиска маршрута в котором есть ключевое слово search.
      const regex = new RegExp(search || '', 'i'); // 'i' флаг делает поиск регистронезависимым

      // Получаем информацию о маршруте из БД.
      const trailsDB = await TrailModel.find({
        ...query,
        $or: [
          { title: { $regex: regex } },
          { region: { $regex: regex } },
          { startLocation: { $regex: regex } },
          { turnLocation: { $regex: regex } },
          { finishLocation: { $regex: regex } },
          { 'blocks.text': { $regex: regex } },
          { 'blocks.title': { $regex: regex } },
          { hashtags: { $regex: regex } },
        ],
      })
        .populate({
          path: 'author',
          select: [
            'id',
            'likedBy',
            'person.firstName',
            'person.patronymic',
            'person.lastName',
            'provider.image',
            'imageFromProvider',
            'image',
          ],
        }) // Получаем информацию об авторе маршрута
        // .populate({ path: 'comments' }) // Нет модели/описания типов.
        .lean<
          (Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser } & {
            isLikedByUser: boolean;
            commentsCount: number;
          })[]
        >();

      // Фильтрация найденных маршрутов по ключевому слову search.
      // const trailsFiltered = trailsDB.filter((trail) =>
      //   trail.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      // );

      if (idUserDB) {
        trailsDB.forEach((trail) => {
          trail.isLikedByUser = trail.likedBy.some((like) => String(like) === idUserDB);
          trail.likedBy = []; // Не нужны на клиенте Id тех кто лайкал.
        });
      } else {
        trailsDB.forEach((trail) => (trail.likedBy = [])); // Не нужны на клиенте Id тех кто лайкал.
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
  public async post({
    formData,
    author,
  }: {
    formData: FormData;
    author: string;
  }): Promise<ServerResponse<null>> {
    // Десериализация данных, полученных с клиента.
    const trail = deserializeTrailCreate(formData);

    const suffixTrack = 'trail_track_gpx-';
    // Сохранение файла трэка.
    const trackGPX = await this.saveFile({
      file: trail.track as File,
      type: 'GPX',
      suffix: suffixTrack,
    });

    const suffixImage = 'trail_image_poster-';
    // Сохранение изображения для Постера маршрута.
    const poster = await this.saveFile({
      file: trail.poster as File,
      type: 'image',
      suffix: suffixImage,
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
      });

      trail.blocks[index].image = urlSaved;
    }

    // Замена строки на массив хэштегов.
    const hashtags = getHashtags(trail.hashtags);

    // Создание slug из title для url страницы маршрута.
    const sequenceValue = await getNextSequenceValue('trail');
    const stringRaw = `${sequenceValue}-${trail.region}-${trail.title}`;
    const urlSlug = slugify(stringRaw, { lower: true, strict: true });

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

    // Логирование действия.
    await ModeratorActionLogService.create({
      moderator: author,
      changes: {
        description: `Создание нового маршрута: "${response.title}"`,
        params: {
          formData: 'Данные создаваемого маршрута в формате FormData',
          author,
        },
      },
      action: 'create',
      entity: this.entity,
      entityIds: [response._id.toString()],
      client: trail.client,
    });

    return { data: null, ok: true, message: 'Маршрут сохранен в БД!' };
  }

  /**
   * Обрабатывает лайк или снятие лайка Маршрута пользователем.
   * @param {Object} params - Объект с параметрами.
   * @param {string} params.idUserDB - Идентификатор пользователя в базе данных.
   * @param {string} params.idNews - Идентификатор новости в базе данных.
   * @returns {Promise<ServerResponse<any>>} - Результат операции учета лайка.
   */
  public async countLike({
    idUserDB,
    idTrail,
  }: {
    idUserDB: string;
    idTrail: string;
  }): Promise<ServerResponse<any>> {
    try {
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
  }): Promise<ServerResponse<null | TNewsInteractiveDto>> {
    try {
      const trailDB = await TrailModel.findOne(
        { _id: idTrail },
        { count: true, likedBy: true }
      ).lean<{
        count: {
          views: number;
          likes: number;
          shares: number;
        };
        likedBy: ObjectId[];
      }>();

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

  /**
   * Сервис получения данных для интерактивного блока маршрута idTrail.
   */
  public async put({
    formData,
    moderator,
  }: {
    formData: FormData;
    moderator: string;
  }): Promise<ServerResponse<null>> {
    try {
      // Десериализация данных, полученных с клиента.
      const trail = deserializeTrailCreate(formData);

      const trailDB = await TrailModel.findOne(
        { urlSlug: trail.urlSlug },
        { createdAt: true, trackGPX: true, _id: false }
      ).lean<{ createdAt: Date; trackGPX: string }>();

      if (!trailDB) {
        throw new Error(`Не найден Маршрут с urlSlug:${trail.urlSlug} для редактирования!`);
      }

      // Экземпляр сервиса работы с Облаком
      const cloud = new Cloud();

      const suffixTrack = 'trail_track_gpx-';
      // Сохранение файла трэка.
      let trackGPX = '';
      // Если существует track, значит он изменялся в процессе редактирования.
      if (trail.track) {
        trackGPX = await this.saveFile({
          file: trail.track as File,
          type: 'GPX',
          suffix: suffixTrack,
        });

        // Удаление старого трека из облака.
        await cloud.deleteFile({
          prefix: trailDB.trackGPX.replace(fileNameFormUrl, '$1'),
        });
      }

      const suffixForSave = 'news_image_title-';
      // Обновление изображения для Постера новости, если оно загружено.
      let poster = '';
      if (trail.poster) {
        poster = await this.saveFile({
          file: trail.poster as File,
          type: 'image',
          suffix: suffixForSave,
        });
      }

      // Удаление старого файла постера, если он был обновлён.
      if (trail.poster && trail.posterOldUrl) {
        await cloud.deleteFile({
          prefix: trail.posterOldUrl.replace(fileNameFormUrl, '$1'),
        });
      }

      // Сохранение изображений из текстовых блоков.
      let index = -1;
      for (const block of trail.blocks) {
        index++;
        // Если нет файла image и imageDeleted:false, то присваиваем старый url этого изображения.
        if (!block.imageFile && !block.imageDeleted) {
          trail.blocks[index].image = block.imageOldUrl;
          continue;
        }

        // Если нет файла image и imageDeleted:true, то удаляем старое изображение из Облака.
        if (!block.image && block.imageDeleted && block.imageOldUrl) {
          await cloud.deleteFile({
            prefix: block.imageOldUrl.replace(fileNameFormUrl, '$1'),
          });
          continue;
        }

        const urlSaved = await this.saveFile({
          file: block.imageFile!, // !!!! попробовать разобраться!
          type: 'image',
          suffix: suffixForSave,
        });

        // Удаление старого файла изображения блока, если оно было обновлён.
        if (block.imageOldUrl) {
          await cloud.deleteFile({
            prefix: block.imageOldUrl.replace(fileNameFormUrl, '$1'),
          });
        }

        trail.blocks[index].image = urlSaved;
      }

      // Замена строки на массив хэштегов.
      const hashtags = getHashtags(trail.hashtags);

      const updateData: Omit<TTrailCreateFromClient, 'hashtags' | 'poster'> & {
        poster: File | null | string;
        hashtags: string[];
      } = { ...trail, hashtags };
      if (poster) {
        updateData.poster = poster;
      }
      if (trackGPX) {
        updateData.trackGPX = trackGPX;
      }

      // slug не обновляется, остается старый для исключения проблем с индексацией.
      const response = await TrailModel.findOneAndUpdate(
        { urlSlug: trail.urlSlug },
        updateData
      );

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: moderator,
        changes: {
          description: `Обновление данных маршрута: "${response.title}"`,
          params: {
            formData: 'Измененные данные маршрута в формате FormData',
            moderator,
          },
        },
        action: 'update',
        entity: this.entity,
        entityIds: [response._id.toString()],
        client: trail.client,
      });

      return { data: null, ok: true, message: 'Данные маршрута обновлены!' };
    } catch (error) {
      this.errorLogger(error); // логирование
      return this.handlerErrorDB(error);
    }
  }
}
