import slugify from 'slugify';

import { User } from '@/database/mongodb/Models/User';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { handlerErrorDB } from './mongodb/error';
import { getNextSequenceValue } from './sequence';
import { deserializeNewsCreate } from '@/libs/utils/deserialization';
import { Cloud } from './cloud';
import { generateFileName } from '@/libs/utils/filename';
import { getHashtags } from '@/libs/utils/text';
import { News as NewsModel } from '@/Models/News';
import type { TNews } from '@/types/models.interface';
import type { MessageServiceDB, TAuthor } from '@/types/index.interface';

type TCloudConnect = {
  cloudName: 'vk';
  bucketName: string;
  domainCloudName: string;
};
type TSaveImage = {
  fileImage: File;
  cloudName: 'vk';
  domainCloudName: string;
  bucketName: string;
};

/**
 * Сервис работы с новостями (News) в БД
 */
export class News {
  private dbConnection: () => Promise<void>;
  constructor() {
    this.dbConnection = connectToMongo;
  }

  /**
   * Создание новой новости.
   */
  public async create(
    formData: FormData,
    { cloudName, bucketName, domainCloudName }: TCloudConnect,
    author: string
  ) {
    try {
      // Десериализация данных, полученных с клиента.
      const news = deserializeNewsCreate(formData);

      // Сохранение изображения для профиля, если оно загружено.
      news.poster = await this.saveImage({
        fileImage: news.poster as File,
        cloudName,
        domainCloudName,
        bucketName,
      });

      // Сохранение изображений из текстовых блоков.
      let index = -1;
      for (const block of news.blocks) {
        index++;
        // Если нет файла, то следующая итерация блоков.
        if (!block.image) {
          continue;
        }

        const urlSaved = await this.saveImage({
          fileImage: block.image as File,
          cloudName,
          domainCloudName,
          bucketName,
        });

        news.blocks[index].image = urlSaved;
      }

      // Замена строки на массив хэштегов.
      news.hashtags = getHashtags(news.hashtags as string);

      // Подключение к БД.
      await this.dbConnection();

      // Создание slug из title для url страницы новости.
      const sequenceValue = await getNextSequenceValue('news');
      const title = `${sequenceValue}-${news.title}`;
      const urlSlug = slugify(title, { lower: true, strict: true });

      const response = await NewsModel.create({ ...news, author, urlSlug });

      if (!response._id) {
        throw new Error('Новость не сохранилась в БД!');
      }

      return { data: null, ok: true, message: 'Новость сохранена в БД!' };
    } catch (error) {
      return handlerErrorDB(error);
    }
  }

  /**
   * Получения списка новостей
   * @param quantity количество последних новостей
   * @returns
   */
  public async getMany({ quantity, idUserDB }: { quantity: number; idUserDB?: string }) {
    try {
      // Подключение к БД.
      this.dbConnection();

      const newsDB: (TNews & { isLikedByUser: boolean })[] = await NewsModel.find()
        .sort({ createdAt: -1 })
        .limit(quantity)
        .lean();

      for (const newsOne of newsDB) {
        if (idUserDB) {
          // isLikedByUser поставил или нет пользователь лайк данной новости
          newsOne.isLikedByUser =
            newsOne.likedBy?.map((id) => id.toString()).includes(idUserDB) || false;
        }
        // Очистка ненужных данных для клиента.
        newsOne.likedBy = [];
      }

      return {
        data: newsDB,
        ok: true,
        message: `Последние новости в количестве ${quantity} шт. `,
      };
    } catch (error) {
      return handlerErrorDB(error);
    }
  }

  /**
   * Получения списка новостей
   * @param urlSlug идентификатор новости
   * @returns
   */
  public async getOne({
    urlSlug,
    idUserDB,
  }: {
    urlSlug: string;
    idUserDB: string | undefined;
  }) {
    try {
      // Подключение к БД.
      this.dbConnection();

      const newsDB: (TNews & TAuthor & { isLikedByUser: boolean }) | null =
        await NewsModel.findOne({ urlSlug })
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
        throw new Error(`Не найдена запрашиваемая новость с адресом ${urlSlug}`);
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

      // Очистка ненужных данных для клиента.
      newsDB.likedBy = [];

      return {
        data: newsDB,
        ok: true,
        message: `Запрашиваемая новости с адресом  ${urlSlug}`,
      };
    } catch (error) {
      return handlerErrorDB(error);
    }
  }

  /**
   * Обрабатывает лайк или снятие лайка новости пользователем.
   * @param {Object} params - Объект с параметрами.
   * @param {string} params.idUserDB - Идентификатор пользователя в базе данных.
   * @param {string} params.idNews - Идентификатор новости в базе данных.
   * @returns {Promise<MessageServiceDB<any>>} - Результат операции учета лайка.
   */
  public async countLike({
    idUserDB,
    idNews,
  }: {
    idUserDB: string;
    idNews: string;
  }): Promise<MessageServiceDB<any>> {
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
      return handlerErrorDB(error);
    }
  }

  async put() {}
  async delete() {}

  /**
   * Сохраняет изображение в облаке и возвращает URL сохраненного файла.
   */
  private async saveImage({
    fileImage,
    cloudName,
    domainCloudName,
    bucketName,
  }: TSaveImage): Promise<string | undefined> {
    if (!fileImage) {
      return undefined;
    }

    let fileName = '';

    if (!fileImage.type.startsWith('image/')) {
      throw new Error(`Загружаемый файл ${fileImage.name} не является изображением`);
    }
    const suffix = 'news_image_title-';
    fileName = generateFileName(fileImage, suffix);

    const cloud = new Cloud(cloudName);
    await cloud.saveFile(fileImage, bucketName, fileName);

    return `https://${bucketName}.${domainCloudName}/${fileName}`;
  }
}
