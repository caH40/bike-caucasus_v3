import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { SiteServicePriceModel } from '@/database/mongodb/Models/SiteServicePrice';
import {
  ServerResponse,
  TEntityNameForSlot,
  TSiteServicePriceForClient,
} from '@/types/index.interface';

/**
 * Сервис работы c прайс листом.
 */
export class PriceService {
  private errorLogger;
  private handlerErrorDB;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

  /**
   * Получение стоимости за штучный сервис на сайте.
   */
  public async getPriceTier({
    entityName,
  }: {
    entityName: TEntityNameForSlot;
  }): Promise<ServerResponse<TSiteServicePriceForClient | null>> {
    try {
      const siteServicePriceDB = await SiteServicePriceModel.findOne(
        {
          entityName,
        },
        { _id: false }
      ).lean<TSiteServicePriceForClient>();

      if (!siteServicePriceDB) {
        throw new Error(`Не найден прайс лист для услуги ${entityName}`);
      }

      return { data: siteServicePriceDB, ok: true, message: `Цены за сервис ${entityName}` };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
