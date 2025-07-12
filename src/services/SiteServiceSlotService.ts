import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import {
  ServerResponse,
  TAvailableSlots,
  TPurchaseMetadata,
  TEntityNameForSlot,
  TOneTimeServiceSimple,
} from '@/types/index.interface';
import { UserPaidServiceAccessModel } from '@/database/mongodb/Models/UserPaidServiceAccess';
import {
  TUserPaidServiceAccess,
  TUserPaidServiceAccessDocument,
} from '@/types/models.interface';
import { Types } from 'mongoose';

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
      // Проверка наличия документа со слотами доступов у пользователя.
      const hasUserServiceAccessDB = await UserPaidServiceAccessModel.findOne({
        user: userDBId,
      }).lean<TUserPaidServiceAccess>();

      // Если не найден докумет
      if (!hasUserServiceAccessDB) {
        await this.initialSlots({ userDBId });
      }

      const userServiceAccessDB = await UserPaidServiceAccessModel.findOne({
        user: userDBId,
        'oneTimeServices.entityName': entityName,
      }).lean<TUserPaidServiceAccess>();

      if (!userServiceAccessDB) {
        throw new Error(
          `Не найдены документ со информацией для доступа к сервису сайта: ${entityName}. Запрос для пользователя с _id:${userDBId}`
        );
      }

      // Поиск данных по слотам для entityName
      const currentServiceAccess = userServiceAccessDB.oneTimeServices.find(
        (s) => s.entityName === entityName
      );

      // Создание объекта для клиента.
      const availableSlots = currentServiceAccess
        ? {
            freeAvailable: currentServiceAccess.freeAvailable,
            trialAvailable: currentServiceAccess.trialAvailable,
            purchasedAvailable: currentServiceAccess.purchasedAvailable,
            totalAvailable:
              currentServiceAccess.purchasedAvailable +
              currentServiceAccess.trialAvailable +
              currentServiceAccess.freeAvailable,
          }
        : null;

      return {
        data: { availableSlots, entityName },
        ok: true,
        message: `Информация о слотах для ${entityName}`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Инициализация слотов пользователю.
   */
  private async initialSlots({
    userDBId,
    oneTimeServices,
  }: {
    userDBId: string | Types.ObjectId;
    oneTimeServices?: TOneTimeServiceSimple[];
  }): Promise<ServerResponse<null>> {
    try {
      // Если не передан объект инициализации.
      const oneTimeServicesForInit = oneTimeServices || [
        {
          entityName: 'championship',
          purchasedAvailable: 0,
          trialAvailable: 3,
          freeAvailable: 0,
          usedHistory: [],
        },
      ];

      await UserPaidServiceAccessModel.create({
        user: userDBId,
        oneTimeServices: oneTimeServicesForInit,
      });

      return {
        data: null,
        ok: true,
        message: `Создан документ с начальными слотами ${JSON.stringify(
          oneTimeServicesForInit,
          null,
          2
        )} для сервисов сайта для пользователя с _id:${userDBId}`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обработка данных покупки, изменение количества купленных слотов пользователя. Сохранение деталей покупки через ЮКассу.
   */
  public async manageServiceSlots({
    actionSlot,
    user,
    metadata: { entityName, quantity },
  }: {
    actionSlot: 'purchase' | 'consume' | 'refund';
    user: Types.ObjectId;
    metadata: TPurchaseMetadata;
  }): Promise<void> {
    try {
      if (actionSlot !== 'purchase' && quantity > 1) {
        throw new Error(
          `При ${actionSlot} количество изменяемых слотов не может быть больше 1! quantity:${quantity}`
        );
      }

      const userPaidServiceDB: TUserPaidServiceAccessDocument | null =
        await UserPaidServiceAccessModel.findOne({
          user: user,
        });

      if (!userPaidServiceDB) {
        throw new Error(
          `Не найден документ со слотами сервисов для пользователя с _id:${user}`
        );
      }

      // Данные по слотам для сервиса entityName.
      const oneTimeService = userPaidServiceDB.oneTimeServices.find(
        (s) => s.entityName === entityName
      );

      // Если oneTimeService не найден, а происходит операция 'consume' | 'refund', значит произошел сбой.
      if (!oneTimeService && (actionSlot === 'consume' || actionSlot === 'refund')) {
        throw new Error(
          `Не найдены данные по слотам для сервиса "${entityName}", хотя происходит операция ${actionSlot}. Пользователь с _id:${user}`
        );
      }

      // Инициализация документа слотов entityName, если происходит покупка, а документа слотов нет в массиве приобретенных сервисов у пользователя.
      let currentOneTimeService = oneTimeService || {
        entityName,
        purchasedAvailable: quantity,
        trialAvailable: 0,
        freeAvailable: 0,
        usedHistory: [],
      };

      switch (actionSlot) {
        case 'consume':
          currentOneTimeService = this.consumeSlot(currentOneTimeService);
          break;

        case 'refund':
          currentOneTimeService = this.refundSlot(currentOneTimeService);
          break;

        case 'purchase':
          currentOneTimeService = this.purchaseSlots({
            oneTimeService: currentOneTimeService,
            quantity,
          });
          break;
        default:
          throw new Error(`Не валидный actionSlot: ${actionSlot}`);
      }

      userPaidServiceDB.oneTimeServices = [
        ...userPaidServiceDB.oneTimeServices.filter((s) => s.entityName !== entityName),
        currentOneTimeService,
      ];

      // Сохранение обновленных данных.
      await userPaidServiceDB.save();
    } catch (error) {
      this.errorLogger(error);
    }
  }

  /**
   * Обработка использования одного слота для услуги.
   * Приоритет списания: trial → free → purchased.
   */
  private consumeSlot(oneTimeService: TOneTimeServiceSimple) {
    // Для данной операции количество уменьшаемых слотов равно 1.
    const SLOT_QUANTITY = 1;

    // Сперва уменьшаются тестовые слоты.
    if (oneTimeService.trialAvailable > 0) {
      return {
        ...oneTimeService,
        trialAvailable: oneTimeService.trialAvailable - SLOT_QUANTITY,
      };
    }

    // Далее уменьшаются подарочные(бесплатные) слоты.
    if (oneTimeService.freeAvailable > 0) {
      return { ...oneTimeService, freeAvailable: oneTimeService.freeAvailable - SLOT_QUANTITY };
    }

    return {
      ...oneTimeService,
      purchasedAvailable: oneTimeService.purchasedAvailable - SLOT_QUANTITY,
    };
  }

  /**
   * Возврат одного ранее использованного слота.
   * Приоритет восстановления: purchased → free → trial.
   */
  private refundSlot(oneTimeService: TOneTimeServiceSimple): TOneTimeServiceSimple {
    const SLOT_QUANTITY = 1;

    // При возврате слота логично сначала восстановить purchased
    if (oneTimeService.purchasedAvailable >= 0) {
      return {
        ...oneTimeService,
        purchasedAvailable: oneTimeService.purchasedAvailable + SLOT_QUANTITY,
      };
    }

    if (oneTimeService.freeAvailable >= 0) {
      return {
        ...oneTimeService,
        freeAvailable: oneTimeService.freeAvailable + SLOT_QUANTITY,
      };
    }

    return {
      ...oneTimeService,
      trialAvailable: oneTimeService.trialAvailable + SLOT_QUANTITY,
    };
  }

  /**
   * Увеличивает количество купленных слотов (используется при покупке).
   */
  private purchaseSlots({
    oneTimeService,
    quantity,
  }: {
    oneTimeService: TOneTimeServiceSimple;
    quantity: number;
  }): TOneTimeServiceSimple {
    return {
      ...oneTimeService,
      purchasedAvailable: oneTimeService.purchasedAvailable + quantity,
    };
  }

  /**
   * Обработка данных покупки, изменение количества купленных слотов пользователя. Сохранение деталей покупки через ЮКассу.
   */
  public async changePurchaseSlotAfter({
    user,
    metadata: { entityName, quantity },
  }: {
    user: Types.ObjectId;
    metadata: TPurchaseMetadata;
  }): Promise<void> {
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
