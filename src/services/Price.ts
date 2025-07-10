import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { SiteServicePriceModel } from '@/database/mongodb/Models/SiteServicePrice';
import { ServerResponse, TEntityNameForSlot } from '@/types/index.interface';
import { TSiteServicePriceDto } from '@/types/dto.types';
import { TSiteServicePrice } from '@/types/models.interface';
import { getPriceDto } from '@/dto/price';

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
  }): Promise<ServerResponse<TSiteServicePriceDto | null>> {
    try {
      const siteServicePriceDB = await SiteServicePriceModel.findOne({
        entityName,
      }).lean<TSiteServicePrice>();

      if (!siteServicePriceDB) {
        throw new Error(`Не найден прайс лист для услуги ${entityName}`);
      }

      return {
        data: getPriceDto(siteServicePriceDB),
        ok: true,
        message: `Цены за сервис ${entityName}`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение стоимости всех сервисов на сайте.
   */
  public async getPrices(): Promise<ServerResponse<TSiteServicePriceDto[] | null>> {
    try {
      const siteServicePricesDB = await SiteServicePriceModel.find().lean<
        TSiteServicePrice[]
      >();

      const priceAfterDto = siteServicePricesDB.map((p) => getPriceDto(p));

      return { data: priceAfterDto, ok: true, message: `Цены за сервис на сайте` };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
