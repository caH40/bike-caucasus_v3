import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { saveFile } from './save-file';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { userPublicSelect } from '@/constants/populate';
import { dtoChampionship, dtoChampionships } from '@/dto/championship';
import type {
  ResponseServer,
  TChampionshipWithOrganizer,
  TCloudConnect,
  TSaveFile,
} from '@/types/index.interface';
import type { TAuthorFromUser, TChampionship } from '@/types/models.interface';
import type { TDtoChampionship } from '@/types/dto.types';
import { deserializeChampionship } from '@/libs/utils/deserialization/championship';
import { getNextSequenceValue } from './sequence';
import slugify from 'slugify';
import { parseGPX } from '@/libs/utils/parse-gpx';
import { getCoordStart } from '@/libs/utils/track';
import { Organizer as OrganizerModel } from '@/database/mongodb/Models/Organizer';
import { ObjectId } from 'mongoose';

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
          select: userPublicSelect,
        })
        .lean();

      if (!championshipDB) {
        throw new Error(`Не найден Чемпионат с urlSlug: ${urlSlug} в БД!`);
      }

      const championship = dtoChampionship(championshipDB);
      return { data: championship, ok: true, message: 'Все Чемпионаты' };
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
        organizer: TAuthorFromUser;
      })[] = await ChampionshipModel.find(query)
        .populate({
          path: 'organizer',
          select: userPublicSelect,
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

      const deserializedFormData = deserializeChampionship(serializedFormData);

      // Сохранение изображения для Постера Чемпионата.
      const posterUrl = await this.saveFile({
        file: deserializedFormData.posterFile as File,
        type: 'image',
        suffix: this.suffixImagePoster,
        cloudName: cloudOptions.cloudName,
        domainCloudName: cloudOptions.domainCloudName,
        bucketName: cloudOptions.bucketName,
      });

      // Сохранение GPX трека маршрута заезда (гонки) для Чемпионата.
      const trackGPXUrl = await this.saveFile({
        file: deserializedFormData.trackGPXFile as File,
        type: 'GPX',
        suffix: this.suffixTrackGpx,
        cloudName: cloudOptions.cloudName,
        domainCloudName: cloudOptions.domainCloudName,
        bucketName: cloudOptions.bucketName,
      });

      // Получаем файл GPX с облака, так как реализация через FileReader большая!
      const gpxParsed = await parseGPX(trackGPXUrl);

      const coordStart = getCoordStart(gpxParsed.gpx.trk[0].trkseg[0].trkpt[0]);

      const trackGPX = {
        url: trackGPXUrl,
        coordStart,
      };

      // Создание slug из name для url страницы Чемпионата.
      const sequenceValue = await getNextSequenceValue('championship');
      const stringRaw = `${sequenceValue}-${deserializedFormData.name}`;
      const urlSlug = slugify(stringRaw, { lower: true, strict: true });

      const createData = {
        name: deserializedFormData.name,
        description: deserializedFormData.description,
        startDate: deserializedFormData.startDate,
        endDate: deserializedFormData.endDate,
        championshipType: deserializedFormData.championshipType,
        bikeType: deserializedFormData.bikeType,
        organizer: deserializedFormData.organizerId,
        posterUrl,
        trackGPX,
        creator,
        urlSlug,
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
}
