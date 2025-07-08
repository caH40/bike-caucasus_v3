import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ServerResponse, TAvailableSlots, TEntityNameForSlot } from '@/types/index.interface';
import { userServiceAccessModel } from '@/database/mongodb/Models/UserServiceAccess';
import { TUserServiceAccess } from '@/types/models.interface';

/**
 * Сервис работы со слотами по доступу к сервисам сайта.
 */
export class SiteServiceSlotService {
  private errorLogger;
  private handlerErrorDB;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

  /**
   * Получение информации по слотам на доступ к сервисам сайта.
   */
  public async getAvailableSlots({
    userDBId,
    entityName,
  }: {
    userDBId: string;
    entityName: TEntityNameForSlot;
  }): Promise<ServerResponse<TAvailableSlots | null>> {
    try {
      const userServiceAccessDB = await userServiceAccessModel
        .findOne({
          user: userDBId,
          'oneTimeServices.entityName': entityName,
        })
        .lean<TUserServiceAccess>();

      if (!userServiceAccessDB) {
        throw new Error(
          `Не найден документ со информацией для доступа к сервисам сайта. Запрос для пользователя с _id:${userDBId}`
        );
      }

      const currentServiceAccess = userServiceAccessDB.oneTimeServices.find(
        (s) => s.entityName === entityName
      );

      // Подсчет общего количества доступных слотов.
      const availableSlots = currentServiceAccess
        ? currentServiceAccess.freeAvailable +
          currentServiceAccess.trialAvailable +
          currentServiceAccess.purchasedAvailable
        : 0;

      return {
        data: { availableSlots: availableSlots || 0, entityName },
        ok: true,
        message: `Информация о слотах для ${entityName}`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
