import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ResponseServer, TSaveFile } from '@/types/index.interface';
import { Organizer as OrganizerModel } from '@/database/mongodb/Models/Organizer';
import { dtoCOrganizer, dtoCOrganizers } from '@/dto/organizer';
import { userPublicSelect } from '@/constants/populate';
import type { TAuthorFromUser, TOrganizer } from '@/types/models.interface';
import type { TDtoOrganizer } from '@/types/dto.types';
import { deserializeOrganizer } from '@/libs/utils/deserialization/organizer';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { saveFile } from './save-file';
import { Cloud } from './cloud';
import { getNextSequenceValue } from './sequence';
import slugify from 'slugify';
import { fileNameFormUrl } from '@/constants/regex';

type GetOneParams =
  | {
      urlSlug?: never;
      creatorId: string;
    }
  | {
      urlSlug: string;
      creatorId?: never;
    };

/**
 * Класс сервиса работы с сущностью Организатор.
 */
export class OrganizerService {
  private errorLogger;
  private handlerErrorDB;
  private dbConnection: () => Promise<void>;
  private saveFile: (params: TSaveFile) => Promise<string>; // eslint-disable-line no-unused-vars
  private suffixImagePoster: string;
  private suffixImageLogo: string;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.dbConnection = connectToMongo;
    this.saveFile = saveFile;
    this.suffixImagePoster = 'organizer_image_poster-';
    this.suffixImageLogo = 'organizer_image_logo-';
  }

  /**
   * Получить всех Организаторов.
   */
  public async getMany(): Promise<ResponseServer<TDtoOrganizer[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

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
    urlSlug,
    creatorId,
  }: GetOneParams): Promise<ResponseServer<TDtoOrganizer | null>> {
    try {
      // Проверка, что только один параметр предоставлен
      if ((!urlSlug && !creatorId) || (urlSlug && creatorId)) {
        throw new Error(
          'Необходимо передать только один из параметров: urlSlug или creatorId.'
        );
      }

      // Подключение к БД.
      await this.dbConnection();

      let query = {} as { urlSlug: string } | { creator: string };

      if (urlSlug) {
        query = { urlSlug };
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
    creator,
  }: {
    serializedFormData: FormData;
    creator: string;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const deserializedFormData = deserializeOrganizer(serializedFormData);

      // Проверка на дубликат имени Организатора.
      const isUniqueName = await OrganizerModel.findOne({ name: deserializedFormData.name });
      if (isUniqueName) {
        throw new Error(
          `Организатор с таким названием: ${deserializedFormData.name} уже существует`
        );
      }

      // Сохранение изображения для Постера маршрута.
      const posterUrl = await this.saveFile({
        file: deserializedFormData.posterFile as File,
        type: 'image',
        suffix: this.suffixImagePoster,
      });

      // Сохранение изображения для Постера маршрута.
      const logoUrl = await this.saveFile({
        file: deserializedFormData.logoFile as File,
        type: 'image',
        suffix: this.suffixImageLogo,
      });

      // Создание slug из name для url страницы Организатора.
      const sequenceValue = await getNextSequenceValue('organizer');
      const stringRaw = `${sequenceValue}-${deserializedFormData.name}`;
      const urlSlug = slugify(stringRaw, { lower: true, strict: true });

      const response = await OrganizerModel.create({
        ...deserializedFormData,
        posterUrl,
        logoUrl,
        creator,
        urlSlug,
      });

      if (!response._id) {
        throw new Error('Организатор не сохранился в БД!');
      }

      return { data: null, ok: true, message: 'Организатор создан, данные сохранены в БД!' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Создание нового Организатора по _id или по creatorId.
   */
  public async put({
    serializedFormData,
  }: {
    serializedFormData: FormData;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const deserializedFormData = deserializeOrganizer(serializedFormData);

      // Экземпляр сервиса работы с Облаком.
      const cloudService = new Cloud();

      let posterUrl: null | string = null;
      // Если вернулся posterUrl, значит Постер был изменен и необходимо удалить старый из облака.
      if (deserializedFormData.posterUrl) {
        await cloudService.deleteFile({
          prefix: deserializedFormData.posterUrl.replace(fileNameFormUrl, '$1'),
        });

        // Сохранение изображения для Постера маршрута.
        posterUrl = await this.saveFile({
          file: deserializedFormData.posterFile as File,
          type: 'image',
          suffix: this.suffixImagePoster,
        });
      }

      let logoUrl: null | string = null;
      // Если вернулся posterUrl, значит Постер был изменен и необходимо удалить старый из облака.
      if (deserializedFormData.logoUrl) {
        await cloudService.deleteFile({
          prefix: deserializedFormData.logoUrl.replace(fileNameFormUrl, '$1'),
        });

        // Сохранение изображения Логотипа Организатора.
        logoUrl = await this.saveFile({
          file: deserializedFormData.logoFile as File,
          type: 'image',
          suffix: this.suffixImageLogo,
        });
      }

      // Создание запроса на изменение данных Организатора.
      const updateData = { ...deserializedFormData };

      if (posterUrl) {
        updateData.posterUrl = posterUrl;
      }
      if (logoUrl) {
        updateData.logoUrl = logoUrl;
      }

      const response = await OrganizerModel.findOneAndUpdate(
        { _id: deserializedFormData.organizerId },
        updateData
      );

      if (!response._id) {
        throw new Error('Изменения данных Организатора не сохранились в БД!');
      }

      return {
        data: null,
        ok: true,
        message: 'Изменения данных Организатора сохранились в БД!',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
