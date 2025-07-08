import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ServerResponse } from '@/types/index.interface';

/**
 * Сервис работы со слотами на чемпионаты.
 */
export class ChampionshipSlotService {
  private errorLogger;
  private handlerErrorDB;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

  /**
   * Получение .
   */
  public async get(): Promise<ServerResponse<null>> {
    try {
      return {
        data: null,
        ok: true,
        message: '',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
