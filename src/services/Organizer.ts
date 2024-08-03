import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ResponseServer } from '@/types/index.interface';
import { Organizer as OrganizerModel } from '@/database/mongodb/Models/Organizer';
import { dtoCOrganizer, dtoCOrganizers } from '@/dto/organizer';
import { userPublicSelect } from '@/constants/populate';
import type { TAuthorFromUser, TOrganizer } from '@/types/models.interface';
import type { TDtoOrganizer } from '@/types/dto.types';

type GetOneParams =
  | {
      _id?: never;
      creatorId: string;
    }
  | {
      _id: string;
      creatorId?: never;
    };

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
            select: userPublicSelect,
          })
          .lean();

      const organizers = dtoCOrganizers(organizersDB);

      return { data: organizers, ok: true, message: 'Все организаторы' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получить Организатора по _id или по creatorId.
   */
  public async getOne({
    _id,
    creatorId,
  }: GetOneParams): Promise<ResponseServer<TDtoOrganizer | null>> {
    try {
      // Проверка, что только один параметр предоставлен
      if ((!_id && !creatorId) || (_id && creatorId)) {
        throw new Error('Необходимо передать только один из параметров: _id или creatorId.');
      }

      let query = {} as { _id: string } | { creator: string };

      if (_id) {
        query = { _id };
      } else if (creatorId) {
        query = { creator: creatorId };
      }

      const organizerDB: (Omit<TOrganizer, 'creator'> & { creator: TAuthorFromUser }) | null =
        await OrganizerModel.findOne(query)
          .populate({
            path: 'creator',
            select: userPublicSelect,
          })
          .lean();

      if (!organizerDB) {
        throw new Error('Не найден запрашиваемый Организатор!');
      }

      const organizer = dtoCOrganizer(organizerDB);

      return { data: organizer, ok: true, message: 'Организатор найден!' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
