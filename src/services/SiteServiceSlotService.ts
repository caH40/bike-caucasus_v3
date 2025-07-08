import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import {
  ServerResponse,
  TAvailableSlots,
  TPurchaseMetadata,
  TEntityNameForSlot,
} from '@/types/index.interface';
import { UserPaidServiceAccessModel } from '@/database/mongodb/Models/UserPaidServiceAccess';
import { TUserPaidServiceAccess } from '@/types/models.interface';

/**
 * Сервис работы со слотами по доступу к платным сервисам сайта.
 * Бесплатные сервисы включаются/отключаются простыми флагами и здесь не учитываются.
 */
export class SiteServiceSlotService {
  private errorLogger;
  private handlerErrorDB;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

  /**
   * Получение информации по слотам на доступ к платным сервисам сайта.
   *
   */
  public async getAvailableSlots({
    userDBId,
    entityName,
  }: {
    userDBId: string;
    entityName: TEntityNameForSlot;
  }): Promise<ServerResponse<TAvailableSlots | null>> {
    try {
      // const res = await userPaidServiceAccessModel.create({
      //   user: userDBId,
      //   oneTimeServices: [{ entityName: 'championship', trialAvailable: 3 }],
      // });

      const userServiceAccessDB = await UserPaidServiceAccessModel.findOne({
        user: userDBId,
        'oneTimeServices.entityName': entityName,
      }).lean<TUserPaidServiceAccess>();

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

  public async handlePurchaseSlot({
    user,
    entityName,
    quantity,
  }: TPurchaseMetadata): Promise<void> {
    try {
      const result = await UserPaidServiceAccessModel.findOneAndUpdate(
        { user: user, 'oneTimeServices.entityName': entityName },
        { $inc: { 'oneTimeServices.$.purchasedAvailable': quantity } }
      );
      // Если ничего не обновилось — значит элемента с таким entityName нет, добавим его
      if (result.modifiedCount === 0) {
        await UserPaidServiceAccessModel.updateOne(
          { user },
          {
            $push: {
              oneTimeServices: {
                entityName,
                purchasedAvailable: quantity,
                trialAvailable: 0,
                freeAvailable: 0,
                usedHistory: [],
              },
            },
          },
          { upsert: true }
        );
      }
    } catch (error) {
      this.errorLogger(error);
    }
  }
}
