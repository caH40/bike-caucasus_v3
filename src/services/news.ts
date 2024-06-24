import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongoose';
import slugify from 'slugify';

import { Cloud } from './cloud';
import { User } from '@/database/mongodb/Models/User';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { handlerErrorDB } from './mongodb/error';
import { getNextSequenceValue } from './sequence';
import { deserializeNewsCreate } from '@/libs/utils/deserialization/news';
import { getHashtags } from '@/libs/utils/text';
import { News as NewsModel } from '@/Models/News';
import { serviceGetInteractiveToDto, dtoNewsGetOne } from '@/dto/news';
import { errorLogger } from '@/errors/error';
import type { TNews, TNewsBlockInfo } from '@/types/models.interface';
import type {
  ResponseServer,
  TCloudConnect,
  TNewsCreateFromClient,
  TSaveFile,
} from '@/types/index.interface';
import type { TAuthor, TNewsGetOneDto, TNewsInteractiveDto } from '@/types/dto.types';
import { millisecondsIn3Days } from '@/constants/date';
import { saveFile } from './save-file';
import { ErrorCustom } from './Error';
import { getCurrentDocsOnPage } from '@/libs/utils/pagination';
import { Comment as CommentModel } from '@/database/mongodb/Models/Comment';

/**
 * Сервис работы с новостями (News) в БД
 */
export class News {
  private dbConnection: () => Promise<void>;
  private errorLogger: (error: unknown) => Promise<void>; // eslint-disable-line no-unused-vars
  private saveFile: (params: TSaveFile) => Promise<string>; // eslint-disable-line no-unused-vars

  constructor() {
    this.dbConnection = connectToMongo;
    this.errorLogger = errorLogger;
    this.saveFile = saveFile;
  }

  /**
   * Создание новой новости.
   */
  public async create(
    formData: FormData,
    { cloudName, bucketName, domainCloudName }: TCloudConnect,
    author: string
  ): Promise<ResponseServer<null>> {
    try {
      // Десериализация данных, полученных с клиента.
      const news = deserializeNewsCreate(formData);

      const suffix = 'news_image_title-';
      // Сохранение изображения для Постера новости.
      const poster = await this.saveFile({
        file: news.poster as File,
        type: 'image',
        suffix,
        cloudName,
        domainCloudName,
        bucketName,
      });

      // Сохранение изображений из текстовых блоков.
      let index = -1;
      for (const block of news.blocks) {
        index++;
        // Если нет файла, то следующая итерация блоков.
        if (!block.imageFile) {
          continue;
        }

        const urlSaved = await this.saveFile({
          file: block.imageFile,
          type: 'image',
          suffix,
          cloudName,
          domainCloudName,
          bucketName,
        });

        news.blocks[index].image = urlSaved;
      }

      // Замена строки на массив хэштегов.
      const hashtags = getHashtags(news.hashtags);

      // Подключение к БД.
      await this.dbConnection();

      // Создание slug из title для url страницы новости.
      const sequenceValue = await getNextSequenceValue('news');
      const title = `${sequenceValue}-${news.title}`;
      const urlSlug = slugify(title, { lower: true, strict: true });

      const response = await NewsModel.create({ ...news, hashtags, poster, author, urlSlug });

      if (!response._id) {
        throw new Error('Новость не сохранилась в БД!');
      }

      return { data: null, ok: true, message: 'Новость сохранена в БД!' };
    } catch (error) {
      this.errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }

  /**
   * Обновление отредактированной новости.
   */
  public async put(
    formData: FormData,
    { cloudName, bucketName, domainCloudName }: TCloudConnect
  ): Promise<ResponseServer<null>> {
    try {
      // Десериализация данных, полученных с клиента.
      const news = deserializeNewsCreate(formData);

      // Подключение к БД.
      await this.dbConnection();

      const newsDB: { createdAt: Date } | null = await NewsModel.findOne(
        { urlSlug: news.urlSlug },
        { createdAt: true, _id: false }
      ).lean();

      if (!newsDB) {
        throw new Error(`Не найдена новость с urlSlug:${news.urlSlug} для редактирования!`);
      }

      // Запрет на удаление новости, если с даты создания прошло более millisecondsIn3Days
      if (Date.now() - new Date(newsDB?.createdAt).getTime() > millisecondsIn3Days) {
        throw new Error(
          'Нельзя редактировать новость, которая была создана больше 3 дней назад!'
        );
      }

      const suffixForSave = 'news_image_title-';
      // Обновление изображения для Постера новости, если оно загружено.
      let poster = '';
      if (news.poster) {
        poster = await this.saveFile({
          file: news.poster as File,
          type: 'image',
          suffix: suffixForSave,
          cloudName,
          domainCloudName,
          bucketName,
        });
      }

      // Инстанс сервиса работы с Облаком
      const cloudService = new Cloud(cloudName);

      // Удаление старого файла постера, если он был обновлён.
      const suffix = `https://${bucketName}.${domainCloudName}/`;
      if (news.poster && news.posterOldUrl) {
        await cloudService.deleteFile(bucketName, news.posterOldUrl.replace(suffix, ''));
      }

      // Сохранение изображений из текстовых блоков.
      let index = -1;
      for (const block of news.blocks) {
        index++;
        // Если нет файла image и imageDeleted:false, то присваиваем старый url этого изображения.
        if (!block.imageFile && !block.imageDeleted) {
          news.blocks[index].image = block.imageOldUrl;
          continue;
        }

        // Если нет файла image и imageDeleted:true, то удаляем старое изображение из Облака.
        if (!block.image && block.imageDeleted && block.imageOldUrl) {
          await cloudService.deleteFile(bucketName, block.imageOldUrl.replace(suffix, ''));
          continue;
        }

        const urlSaved = await this.saveFile({
          file: block.imageFile!, // !!!! попробовать разобраться!
          type: 'image',
          suffix: suffixForSave,
          cloudName,
          domainCloudName,
          bucketName,
        });

        // Удаление старого файла изображения блока, если оно было обновлён.
        if (block.imageOldUrl) {
          await cloudService.deleteFile(bucketName, block.imageOldUrl.replace(suffix, ''));
        }

        news.blocks[index].image = urlSaved;
      }

      // Замена строки на массив хэштегов.
      const hashtags = getHashtags(news.hashtags);

      const updateData: Omit<TNewsCreateFromClient, 'hashtags' | 'poster'> & {
        poster: File | null | string;
        hashtags: string[];
      } = { ...news, hashtags };
      if (poster) {
        updateData.poster = poster;
      }

      // slug не обновляется, остается старый для исключения проблем с индексацией.
      await NewsModel.findOneAndUpdate({ urlSlug: news.urlSlug }, updateData);

      return { data: null, ok: true, message: 'Данные новости обновлены!' };
    } catch (error) {
      this.errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }

  /**
   * Получения списка новостей
   * @param quantity количество последних новостей
   * @returns
   */
  public async getMany({
    idUserDB,
    page = 1,
    docsOnPage = 10,
    query = {},
  }: {
    idUserDB?: string;
    page?: number;
    docsOnPage?: number;
    query?: Partial<{ [K in keyof TNewsGetOneDto]: TNewsGetOneDto[K] }>;
  }): Promise<
    ResponseServer<null | {
      news: TNewsGetOneDto[];
      currentPage: number;
      quantityPages: number;
    }>
  > {
    try {
      // Подключение к БД.
      this.dbConnection();

      const newsDB: (Omit<TNews, 'author'> & { author: TAuthor } & {
        isLikedByUser: boolean;
        commentsCount: number;
      })[] = await NewsModel.find(query)
        .sort({ createdAt: -1 })
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
        })
        .lean();

      for (const newsOne of newsDB) {
        const commentsDB = await CommentModel.find({
          document: { _id: String(newsOne._id), type: 'news' },
        });
        newsOne.commentsCount = commentsDB.length;
      }

      const { currentDocs, currentPage, quantityPages } = getCurrentDocsOnPage(
        newsDB,
        page,
        docsOnPage
      );

      for (const newsOne of currentDocs) {
        if (idUserDB) {
          // isLikedByUser поставил или нет пользователь лайк данной новости
          newsOne.isLikedByUser =
            newsOne.likedBy?.map((id) => id.toString()).includes(idUserDB) || false;
        }
        // Очистка ненужных данных для клиента.
        newsOne.likedBy = [];
      }

      return {
        data: {
          news: currentDocs.map((newsOne) => dtoNewsGetOne(newsOne)),
          currentPage,
          quantityPages,
        },
        ok: true,
        message: `Массив новостей.`,
      };
    } catch (error) {
      this.errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }

  /**
   * Получения одной новости.
   * @param urlSlug идентификатор новости
   * @returns
   */
  public async getOne({
    urlSlug,
    idUserDB,
  }: {
    urlSlug: string;
    idUserDB: string | undefined;
  }): Promise<ResponseServer<null | TNewsGetOneDto>> {
    try {
      // Подключение к БД.
      this.dbConnection();

      const newsDB:
        | (Omit<TNews, 'author'> & { author: TAuthor } & {
            isLikedByUser: boolean;
            commentsCount: number;
          })
        | null = await NewsModel.findOne({ urlSlug })
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
        })
        .lean();

      if (!newsDB) {
        throw new ErrorCustom(`Не найдена запрашиваемая новость с адресом ${urlSlug}`, 404);
      }

      // isLikedByUser поставил или нет пользователь лайк данной новости
      if (idUserDB) {
        const res = await NewsModel.findOne(
          {
            urlSlug,
            likedBy: { $elemMatch: { $eq: idUserDB } },
          },
          { _id: true }
        );

        newsDB.isLikedByUser = res ? true : false;
      }

      const commentsDB = await CommentModel.find({
        document: { _id: String(newsDB._id), type: 'news' },
      });
      newsDB.commentsCount = commentsDB.length;

      return {
        data: dtoNewsGetOne(newsDB),
        ok: true,
        message: `Запрашиваемая новости с адресом  ${urlSlug}`,
      };
    } catch (error) {
      this.errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }

  /**
   * Сервис получения данных для интерактивного блока новости idNews.
   */
  public async getInteractive({
    idNews,
    idUserDB,
  }: {
    idNews: string;
    idUserDB: string | undefined;
  }): Promise<ResponseServer<null | TNewsInteractiveDto>> {
    try {
      // Подключение к БД.
      this.dbConnection();

      const newsDB: { viewsCount: number; likesCount: number } | null = await NewsModel.findOne(
        { _id: idNews },
        { viewsCount: true, likesCount: true, _id: false }
      ).lean();

      if (!newsDB) {
        throw new Error(`Не найдена запрашиваемая новость с _id:${idNews}`);
      }

      let isLikedByUser = false;

      // isLikedByUser поставил или нет пользователь лайк данной новости
      if (idUserDB) {
        const res = await NewsModel.findOne(
          {
            _id: idNews,
            likedBy: { $elemMatch: { $eq: idUserDB } },
          },
          { _id: true }
        );

        isLikedByUser = res ? true : false;
      }

      const commentsDB = await CommentModel.find({ document: { _id: idNews, type: 'news' } });
      const commentsCount = commentsDB.length;

      return {
        data: serviceGetInteractiveToDto(newsDB, isLikedByUser, commentsCount),
        ok: true,
        message: `Запрашиваемая новости с адресом  ${idNews}`,
      };
    } catch (error) {
      this.errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }

  /**
   * Подсчет просмотра новости любыми пользователями.
   */
  public async countView({
    idNews,
  }: {
    idNews?: string | null;
  }): Promise<ResponseServer<null>> {
    try {
      if (!idNews) {
        throw new Error(`Не получена _id новости`);
      }
      // Подключение к БД.
      this.dbConnection();

      const newsDB = await NewsModel.findOneAndUpdate(
        { _id: idNews },
        { $inc: { viewsCount: 1 } }
      );

      if (!newsDB) {
        throw new Error(`Новость с не найдена с _id:${idNews}`);
      }

      return {
        data: null,
        ok: true,
        message: `Учет просмотра новости с _id:${idNews}`,
      };
    } catch (error) {
      this.errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }

  /**
   * Обрабатывает лайк или снятие лайка новости пользователем.
   * @param {Object} params - Объект с параметрами.
   * @param {string} params.idUserDB - Идентификатор пользователя в базе данных.
   * @param {string} params.idNews - Идентификатор новости в базе данных.
   * @returns {Promise<ResponseServer<any>>} - Результат операции учета лайка.
   */
  public async countLike({
    idUserDB,
    idNews,
  }: {
    idUserDB: string;
    idNews: string;
  }): Promise<ResponseServer<any>> {
    try {
      // Подключение к БД.
      this.dbConnection();

      const userDB = await User.findOne({ _id: idUserDB });
      if (!userDB) {
        throw new Error(`Не найден пользователь с _id:${userDB}`);
      }

      const newsDB = await NewsModel.findOne({ _id: idNews });
      if (!newsDB) {
        throw new Error(`Новость с не найдена с _id:${idNews}`);
      }

      if (newsDB.likedBy.includes(idUserDB)) {
        const userIndex = newsDB.likedBy.indexOf(idUserDB);
        newsDB.likedBy.splice(userIndex, 1);
        newsDB.likesCount = newsDB.likedBy.length;
      } else {
        newsDB.likedBy.push(idUserDB);
        newsDB.likesCount = newsDB.likedBy.length;
      }

      await newsDB.save();

      return {
        data: null,
        ok: true,
        message: `Учет лайка от пользователя _id:${idUserDB}`,
      };
    } catch (error) {
      this.errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }

  /**
   * Удаление новости админом или модератором, который создал новость.
   */
  public async delete(
    { urlSlug, idUserDB }: { urlSlug: string; idUserDB: string },
    { cloudName, bucketName, domainCloudName }: TCloudConnect
  ) {
    try {
      // Подключение к БД.
      this.dbConnection();

      // Проверка, является ли модератор, удаляющий новость, администратором.
      const user: { role: { name: string } } | null = await User.findOne(
        { _id: idUserDB },
        { role: true }
      )
        .populate({ path: 'role', select: ['name', '-_id'] })
        .lean();

      // Админ может удалить любую новость. Модератор только свою.
      const isAdmin = user?.role.name === 'admin';
      const query = isAdmin ? { urlSlug } : { urlSlug, author: idUserDB };

      const newsDB: {
        _id: ObjectId;
        createdAt: Date;
        poster: string;
        blocks: TNewsBlockInfo[];
      } | null = await NewsModel.findOne(query, {
        createdAt: true,
        poster: true,
        blocks: true,
      });

      if (!newsDB) {
        throw new Error('Не найдена новость или у вас нет прав на удаление данной новости!');
      }

      // Запрет на удаление новости, если с даты создания прошло более millisecondsIn3Days
      if (Date.now() - new Date(newsDB?.createdAt).getTime() > millisecondsIn3Days) {
        throw new Error('Нельзя удалить новость, которая была создана больше 3 дней назад!');
      }

      // Инстанс сервиса работы с Облаком
      const cloudService = new Cloud(cloudName);

      // Удаление всех файлов новости с Облака.
      const suffix = `https://${bucketName}.${domainCloudName}/`;
      await cloudService.deleteFile(bucketName, newsDB.poster.replace(suffix, ''));
      for (const block of newsDB.blocks) {
        if (block.image) {
          await cloudService.deleteFile(bucketName, block.image.replace(suffix, ''));
        }
      }

      const newsDeleted = await NewsModel.findOneAndDelete(query);
      if (!newsDeleted) {
        throw new Error('Не найдена новость на удаление!');
      }

      // Ревалидация данных после удаления новости.
      revalidatePath('/');

      return {
        data: null,
        ok: true,
        message: `Удалена новость с urlSlug:${urlSlug}!`,
      };
    } catch (error) {
      this.errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }
}
