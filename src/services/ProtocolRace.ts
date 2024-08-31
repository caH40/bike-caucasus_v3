import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { ResponseServer } from '@/types/index.interface';
import { deserializationResultRaceRider } from '@/libs/utils/deserialization/resultRaceRider';

/**
 * Сервис работы с финишным протоколом заезда Чемпионата.
 */
export class ProtocolRaceService {
  private errorLogger;
  private handlerErrorDB;
  private dbConnection: () => Promise<void>;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.dbConnection = connectToMongo;
  }

  public async getOne(): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      return { data: null, ok: true, message: 'Данные заезда Чемпионата' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Добавление результата райдера в Заезде Чемпионата в протокол.
   */
  public async post({
    dataFromFormSerialized,
    creatorId,
  }: {
    dataFromFormSerialized: FormData;
    creatorId: string;
  }): Promise<ResponseServer<null>> {
    try {
      const dataDeserialized = deserializationResultRaceRider(dataFromFormSerialized);
      console.log(dataDeserialized);

      // Подключение к БД.
      await this.dbConnection();

      return { data: null, ok: true, message: '' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
