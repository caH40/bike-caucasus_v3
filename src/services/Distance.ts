import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { DistanceModel } from '@/database/mongodb/Models/Distance';
import { deserializeDistance } from '@/libs/utils/deserialization/distance';
import { getCoordStart } from '@/libs/utils/track';
import { parseGPX } from '@/libs/utils/parse-gpx';
import { saveFile } from './save-file';
import { getTrackStatsFromTrackData } from '@/libs/utils/track-data';
import { parseGPXTrack } from '@/libs/utils/track-parse';
import { distanceDto } from '@/dto/distance';
import { ModeratorActionLogService } from './ModerationActionLog';

// types
import { TDistance, TTrackGPXObj } from '@/types/models.interface';
import {
  ServerResponse,
  TPutDistanceServiceParams,
  TServiceEntity,
} from '@/types/index.interface';
import { TDistanceDto } from '@/types/dto.types';
import slugify from 'slugify';
import { getNextSequenceValue } from './sequence';

/**
 * Класс работы с дистанций для заездов чемпионата.
 */
export class DistanceService {
  private errorLogger;
  private handlerErrorDB;
  private entity: TServiceEntity;

  private suffixTrackGpx: string;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.entity = 'distance';
    this.suffixTrackGpx = 'distance_track_gpx-';
  }

  /**
   * Получение запрашиваемой дистанции.
   */
  public async get(urlSlug: string): Promise<ServerResponse<TDistanceDto | null>> {
    try {
      const distanceDB = await DistanceModel.findOne({ urlSlug }).lean<TDistance>();

      if (!distanceDB) {
        throw new Error(`Не найдена дистанция с urlSlug: ${urlSlug}`);
      }

      return {
        data: distanceDto(distanceDB),
        ok: true,
        message: 'Все дистанции для чемпионатов',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение всех дистанций.
   */
  public async getAll(): Promise<ServerResponse<TDistanceDto[] | null>> {
    try {
      const distanceDB = await DistanceModel.find().lean<TDistance[]>();

      return {
        data: distanceDB.map((distance) => distanceDto(distance)),
        ok: true,
        message: 'Все дистанции для чемпионатов',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Создание дистанции для заездов чемпионатов.
   */
  public async create({
    creatorId,
    serializedData,
  }: {
    creatorId: string;
    serializedData: FormData;
  }): Promise<ServerResponse<null>> {
    try {
      const { name, description, trackGPXFile, surfaceType, client } =
        deserializeDistance(serializedData);

      // Сохранение трека на облаке.
      const { trackGPX } = await this.processTrackGPX(trackGPXFile);

      // GPX трек из облака.
      const trackData = await parseGPXTrack(trackGPX.url);

      // Расчетные данные по треку (расстояние, средний градиент и т.д.)
      const stats = getTrackStatsFromTrackData(trackData);

      // Генерация urlSlug.
      const urlSlug = await this.getUrlSlug(name);

      const response = await DistanceModel.create({
        creator: creatorId,
        urlSlug,
        name,
        description,
        trackGPX,
        surfaceType,
        isPublic: true,
        elevationProfile: trackData,
        isElevationProfileReady: !!trackData,
        ...stats,
      });

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: creatorId,
        changes: {
          description: `Создана дистанция с названием: "${response.name}"`,
          params: {
            name,
            description,
            trackGPXFile,
            surfaceType,
          },
        },
        action: 'create',
        entity: this.entity,
        entityIds: response._id,
        client,
      });

      return {
        data: null,
        ok: true,
        message: 'Данные дистанции успешно сохранены в БД',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Создание urlSlug дистанции.
   */
  private async getUrlSlug(name: string): Promise<string> {
    const normalizedSlug = slugify(name, { lower: true, strict: true });

    const sequenceValue = await getNextSequenceValue('distance');
    return `${sequenceValue}-${normalizedSlug}`;
  }

  /**
   * Обновление дистанции для заездов чемпионатов.
   */
  public async put({
    distanceId,
    updatedData,
    moderatorId,
    client,
  }: TPutDistanceServiceParams): Promise<ServerResponse<null>> {
    try {
      const distanceDB = await DistanceModel.findOneAndUpdate(
        { _id: distanceId },
        {
          $set: { ...updatedData },
        }
      ).lean();

      if (!distanceDB) {
        throw new Error(`Не найдена дистанция с _id: ${distanceId}`);
      }

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: moderatorId,
        changes: updatedData,
        action: 'update',
        entity: this.entity,
        entityIds: [distanceId],
        client,
      });

      return {
        data: null,
        ok: true,
        message: 'Данные дистанции успешно сохранены в БД',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обработка GPX трека.
   */
  private async processTrackGPX(
    file: File,
    oldUrl?: string
  ): Promise<{ trackGPX: TTrackGPXObj; oldUrl?: string }> {
    const trackGPXUrl = await saveFile({
      file,
      type: 'GPX',
      suffix: this.suffixTrackGpx,
    });

    const gpxParsed = await parseGPX(trackGPXUrl);
    const coordStart = getCoordStart(gpxParsed.gpx.trk[0].trkseg[0].trkpt[0]);

    return {
      trackGPX: {
        url: trackGPXUrl,
        coordStart,
      },
      oldUrl,
    };
  }
}
