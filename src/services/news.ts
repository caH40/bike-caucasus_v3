import { connectToMongo } from '@/database/mongodb/mongoose';
import { handlerErrorDB } from './mongodb/error';

import { deserializeNewsCreate } from '@/libs/utils/deserialization';

type TCloudConnect = { cloudName: 'vk'; bucketName: string; domainCloudName: string };

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
  async create(formData: FormData, { cloudName, bucketName, domainCloudName }: TCloudConnect) {
    try {
      const news = deserializeNewsCreate(formData);

      // Десериализация данных, полученных с клиента

      return { data: null, ok: true, message: 'ok' };
    } catch (error) {
      return handlerErrorDB(error);
    }
  }

  async put() {}
  async delete() {}
  async get() {}
  async getOne() {}
}
