import { connectToMongo } from '@/database/mongodb/mongoose';
import { handlerErrorDB } from './mongodb/error';

import { deserializeNewsCreate } from '@/libs/utils/deserialization';
import { Cloud } from './cloud';
import { generateFileName } from '@/libs/utils/filename';
import { getHashtags } from '@/libs/utils/text';
import { News as NewsModel } from '@/Models/News';

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

      // Замена строки на массив хэштегов
      news.hashtags = getHashtags(news.hashtags as string);
      // console.log(news);

      await this.dbConnection();

      const response = await NewsModel.create({ ...news, author });
      if (!response._id) {
        throw new Error('Новость не сохранилась в БД!');
      }

      return { data: null, ok: true, message: 'Новость сохранена в БД!' };
    } catch (error) {
      return handlerErrorDB(error);
    }
  }

  async put() {}
  async delete() {}
  async get() {}
  async getOne() {}

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
