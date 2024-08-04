import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ResponseServer, TCloudConnect, TSaveFile } from '@/types/index.interface';
import { Organizer as OrganizerModel } from '@/database/mongodb/Models/Organizer';
import { dtoCOrganizer, dtoCOrganizers } from '@/dto/organizer';
import { userPublicSelect } from '@/constants/populate';
import type { TAuthorFromUser, TOrganizer } from '@/types/models.interface';
import type { TDtoOrganizer } from '@/types/dto.types';
import { deserializeOrganizerCreate } from '@/libs/utils/deserialization/organizer';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { saveFile } from './save-file';

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
  private dbConnection: () => Promise<void>;
  private saveFile: (params: TSaveFile) => Promise<string>; // eslint-disable-line no-unused-vars

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.dbConnection = connectToMongo;
    this.saveFile = saveFile;
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

  /**
   * Создание нового Организатора по _id или по creatorId.
   */
  public async post({
    serializedFormData,
    cloudOptions,
    creator,
  }: {
    serializedFormData: FormData;
    cloudOptions: TCloudConnect;
    creator: string;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const deserializedFormData = deserializeOrganizerCreate(serializedFormData);

      // Проверка на дубликат имени Организатора.
      const isUniqueName = await OrganizerModel.findOne({ name: deserializedFormData.name });
      if (isUniqueName) {
        throw new Error(
          `Организатор с таким названием: ${deserializedFormData.name} уже существует`
        );
      }

      const suffixImage = 'organizer_image_poster-';
      // Сохранение изображения для Постера маршрута.
      const posterUrl = await this.saveFile({
        file: deserializedFormData.poster as File,
        type: 'image',
        suffix: suffixImage,
        cloudName: cloudOptions.cloudName,
        domainCloudName: cloudOptions.domainCloudName,
        bucketName: cloudOptions.bucketName,
      });

      const suffixImageLogo = 'organizer_image_logo-';
      // Сохранение изображения для Постера маршрута.
      const logoUrl = await this.saveFile({
        file: deserializedFormData.poster as File,
        type: 'image',
        suffix: suffixImageLogo,
        cloudName: cloudOptions.cloudName,
        domainCloudName: cloudOptions.domainCloudName,
        bucketName: cloudOptions.bucketName,
      });

      const response = await OrganizerModel.create({
        ...deserializedFormData,
        posterUrl,
        logoUrl,
        creator,
      });

      if (!response._id) {
        throw new Error('Маршрут не сохранился в БД!');
      }

      return { data: null, ok: true, message: 'Организатор создан, данные сохранены в БД!' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
