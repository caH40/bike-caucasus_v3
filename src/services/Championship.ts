import { Document, ObjectId } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { saveFile } from './save-file';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { organizerSelect } from '@/constants/populate';
import { dtoChampionship, dtoChampionships, dtoToursAndSeries } from '@/dto/championship';
import type {
  ResponseServer,
  TChampionshipWithOrganizer,
  TOrganizerPublic,
  TSaveFile,
} from '@/types/index.interface';
import type {
  TChampionship,
  TChampionshipDocument,
  TChampionshipStatus,
  TTrackGPXObj,
} from '@/types/models.interface';
import type { TDtoChampionship } from '@/types/dto.types';
import { deserializeChampionship } from '@/libs/utils/deserialization/championship';
import { getNextSequenceValue } from './sequence';
import slugify from 'slugify';
import { parseGPX } from '@/libs/utils/parse-gpx';
import { getCoordStart } from '@/libs/utils/track';
import { Organizer as OrganizerModel } from '@/database/mongodb/Models/Organizer';
import { Cloud } from './cloud';
import { fileNameFormUrl } from '@/constants/regex';

/**
 * Класс работы с сущностью Чемпионат.
 */
export class ChampionshipService {
  private errorLogger;
  private handlerErrorDB;
  private dbConnection: () => Promise<void>;
  private saveFile: (params: TSaveFile) => Promise<string>; // eslint-disable-line no-unused-vars
  private suffixImagePoster: string;
  private suffixTrackGpx: string;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.dbConnection = connectToMongo;
    this.saveFile = saveFile;
    this.suffixImagePoster = 'championship_image_poster-';
    this.suffixTrackGpx = 'championship_track_gpx-';
  }

  public async getOne({
    urlSlug,
  }: {
    urlSlug: string;
  }): Promise<ResponseServer<TDtoChampionship | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const championshipDB: TChampionshipWithOrganizer | null = await ChampionshipModel.findOne(
        { urlSlug }
      )
        .populate({
          path: 'organizer',
          select: organizerSelect,
        })
        .lean();

      if (!championshipDB) {
        throw new Error(`Не найден Чемпионат с urlSlug: ${urlSlug} в БД!`);
      }

      const championship = dtoChampionship(championshipDB);
      return { data: championship, ok: true, message: 'Данные запрашиваемого Чемпионата' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение всех Чемпионатов.
   */
  public async getMany({
    idUserDB,
    forModeration,
  }: {
    idUserDB?: string;
    forModeration?: boolean;
  }): Promise<ResponseServer<TDtoChampionship[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      let query = {};
      // Если запрос для модерации, значит необходимо вернуть Чемпионаты, созданные idUserDB.
      if (forModeration && idUserDB) {
        const organizer: { _id: ObjectId } | null = await OrganizerModel.findOne(
          { creator: idUserDB },
          { _id: true }
        ).lean();

        if (!organizer) {
          throw new Error('У пользователя не создан Организатор!');
        }

        query = { organizer: organizer._id };
      }

      const championshipsDB: (Omit<TChampionship, 'organizer'> & {
        organizer: TOrganizerPublic;
      })[] = await ChampionshipModel.find(query)
        .populate({
          path: 'organizer',
          select: organizerSelect,
        })
        .lean();

      const championships = dtoChampionships(championshipsDB);

      return { data: championships, ok: true, message: 'Все Чемпионаты' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Создание нового Чемпионата по _id или по creatorId.
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

      const {
        posterFile,
        trackGPXFile,
        name,
        description,
        startDate,
        endDate,
        type,
        bikeType,
        organizerId,
        parentChampionshipId,
      } = deserializeChampionship(serializedFormData);

      // Сохранение изображения для Постера Чемпионата.
      const posterUrl = await this.saveFile({
        file: posterFile as File,
        type: 'image',
        suffix: this.suffixImagePoster,
      });

      // Трек не обязателен, поэтому проверка для загрузки файла на облако.
      let trackGPX = {} as TTrackGPXObj;
      if (trackGPXFile) {
        // Сохранение GPX трека маршрута заезда (гонки) для Чемпионата.
        const trackGPXUrl = await this.saveFile({
          file: trackGPXFile as File,
          type: 'GPX',
          suffix: this.suffixTrackGpx,
        });

        // Получаем файл GPX с облака, так как реализация через FileReader большая!
        const gpxParsed = await parseGPX(trackGPXUrl);

        const coordStart = getCoordStart(gpxParsed.gpx.trk[0].trkseg[0].trkpt[0]);

        trackGPX = {
          url: trackGPXUrl,
          coordStart,
        };
      }

      // Создание slug из name для url страницы Чемпионата.
      const sequenceValue = await getNextSequenceValue('championship');
      const stringRaw = `${sequenceValue}-${name}`;
      const urlSlug = slugify(stringRaw, { lower: true, strict: true });

      const createData: any = {
        name,
        description,
        startDate,
        endDate,
        type: type,
        bikeType,
        organizer: organizerId,
        posterUrl,
        creator,
        urlSlug,
        ...(parentChampionshipId && {
          parentChampionship: parentChampionshipId,
        }),
        ...(trackGPX.url && { trackGPX }),
      };

      const response = await ChampionshipModel.create(createData);

      if (!response._id) {
        throw new Error('Чемпионат не сохранился в БД!');
      }

      return { data: null, ok: true, message: 'Чемпионат создан, данные сохранены в БД!' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновления данных Чемпионата.
   */
  public async put({
    serializedFormData,
  }: {
    serializedFormData: FormData;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const {
        championshipId,
        posterFile,
        trackGPXFile,
        name,
        description,
        startDate,
        endDate,
        type,
        bikeType,
        needDelTrack,
        parentChampionshipId,
      } = deserializeChampionship(serializedFormData);

      const championshipDB: TChampionshipDocument | null = await ChampionshipModel.findOne({
        _id: championshipId,
      });

      if (!championshipDB) {
        throw new Error(`Не найден Чемпионат ${name} для обновления данных!`);
      }

      // Экземпляр сервиса работы с Облаком
      const cloud = new Cloud();

      // Если существует posterFile значит Постер был обновлён.
      // Сохранение Постера.
      let posterUrl = '';
      if (posterFile) {
        posterUrl = await this.saveFile({
          file: posterFile as File,
          type: 'image',
          suffix: this.suffixImagePoster,
        });

        // Удаление старого Постера Чемпионата из облака.
        await cloud.deleteFile({
          prefix: championshipDB.posterUrl.replace(fileNameFormUrl, '$1'),
        });
      }

      // Если существует trackGPXFile значит GPX трек был обновлён.
      // Сохранение Постера.
      let trackGPX: TTrackGPXObj | null = null;
      if (trackGPXFile) {
        const trackGPXUrl = await this.saveFile({
          file: trackGPXFile as File,
          type: 'GPX',
          suffix: this.suffixTrackGpx,
        });

        // Получаем файл GPX с облака, так как реализация через FileReader большая!
        const gpxParsed = await parseGPX(trackGPXUrl);

        const coordStart = getCoordStart(gpxParsed.gpx.trk[0].trkseg[0].trkpt[0]);

        trackGPX = {
          url: trackGPXUrl,
          coordStart,
        };

        // Удаление старого GPX трек из облака.
        await cloud.deleteFile({
          prefix: championshipDB.trackGPX?.url?.replace(fileNameFormUrl, '$1'),
        });
      }

      // Внимание! Добавлять соответствующие обновляемые свойства Чемпионата в ручную.
      const updateData: any = {
        name,
        description,
        startDate,
        endDate,
        type,
        bikeType,
        ...(trackGPX && { trackGPX }), // Обновление только если trackGPX не null
        ...(posterUrl && { posterUrl }), // Обновление только если posterUrl не пуст
        ...(parentChampionshipId && {
          parentChampionship: parentChampionshipId,
        }),
      };

      // При редактировании выбрана опция удаления Трека Чемпионата.
      if (needDelTrack) {
        await cloud.deleteFile({
          prefix: championshipDB.trackGPX?.url.replace(fileNameFormUrl, '$1'),
        });
        updateData.trackGPX = {}; // Обновление поля trackGPX на пустой объект.
      }

      await championshipDB.updateOne(updateData);

      return { data: null, ok: true, message: 'Данные Чемпионата обновлены в БД!' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Удаление Чемпионата.
   */
  public async delete({ urlSlug }: { urlSlug: string }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const championshipDB:
        | ({
            status: TChampionshipStatus;
            name: string;
            posterUrl: string;
            trackGPX: TTrackGPXObj;
          } & Document)
        | null = await ChampionshipModel.findOne(
        { urlSlug },
        {
          status: true,
          name: true,
          posterUrl: true,
          trackGPX: true,
        }
      );

      if (!championshipDB) {
        throw new Error(`Не найден Чемпионат с urlSlug: ${urlSlug} в БД!`);
      }

      // Можно удалять только Чемпионаты которые еще не начались.
      if (championshipDB.status !== 'upcoming') {
        throw new Error(`Можно удалять только Чемпионаты которые еще не начались`);
      }

      // Удаление документа Чемпионат
      await championshipDB.deleteOne();

      // Экземпляр сервиса работы с Облаком
      const cloudService = new Cloud();

      // Удаление Постера с облака.
      await cloudService.deleteFile({
        prefix: championshipDB.posterUrl.replace(fileNameFormUrl, '$1'),
      });

      // Удаление GPX трека с облака.
      if (championshipDB.trackGPX.url) {
        await cloudService.deleteFile({
          prefix: championshipDB.trackGPX.url.replace(fileNameFormUrl, '$1'),
        });
      }

      return {
        data: null,
        ok: true,
        message: `Чемпионат ${championshipDB.name} удалён!`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Удаление Чемпионата.
   */
  public async getTourAndSeries({
    organizerId,
  }: {
    organizerId: string;
  }): Promise<ResponseServer<{ _id: string; name: string }[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const championshipsDB: { _id: ObjectId; name: string }[] = await ChampionshipModel.find(
        {
          organizer: organizerId,
          type: ['series', 'tour'],
        },
        { name: true }
      ).lean();

      return {
        data: dtoToursAndSeries(championshipsDB),
        ok: true,
        message: `Список Серий и Туров.`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
