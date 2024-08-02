import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ResponseServer } from '@/types/index.interface';
import { Organizer as OrganizerModel } from '@/database/mongodb/Models/Organizer';
import { dtoCOrganizers } from '@/dto/organizer';
import type { TAuthorFromUser, TOrganizer } from '@/types/models.interface';
import type { TDtoOrganizer } from '@/types/dto.types';

/**
 * Класс сервиса работы с Календарем событий.
 */
export class OrganizerService {
  private errorLogger;
  private handlerErrorDB;
  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

  /**
   * Получить всех Организаторов.
   */
  public async getMany(): Promise<ResponseServer<TDtoOrganizer[] | null>> {
    try {
      const organizersDB: (Omit<TOrganizer, 'creator'> & { creator: TAuthorFromUser })[] =
        await OrganizerModel.find()
          .populate({
            path: 'creator',
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

      const organizers = dtoCOrganizers(organizersDB);

      return { data: organizers, ok: true, message: 'Все организаторы' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
