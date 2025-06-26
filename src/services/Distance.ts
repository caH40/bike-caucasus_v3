import { errorLogger } from '@/errors/error';
import { ServerResponse, TServiceEntity } from '@/types/index.interface';
import { handlerErrorDB } from './mongodb/error';
import { DistanceModel } from '@/database/mongodb/Models/Distance';
import { deserializeDistance } from '@/libs/utils/deserialization/distance';
import { TTrackGPXObj } from '@/types/models.interface';
import { getCoordStart } from '@/libs/utils/track';
import { parseGPX } from '@/libs/utils/parse-gpx';
import { saveFile } from './save-file';

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
   * Получение всех дистанций.
   */
  public async getOne(): Promise<ServerResponse<null>> {
    try {
      const distancesDB = await DistanceModel.find();

      return {
        data: distancesDB,
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
    creatorId?: string;
    serializedData: FormData;
  }): Promise<ServerResponse<null>> {
    try {
      const { name, description, trackGPXFile, surfaceType } =
        deserializeDistance(serializedData);

      // Сохранение трека на облаке.

      const { trackGPX } = await this.processTrackGPX(trackGPXFile);

      await DistanceModel.create({
        creator: creatorId,
        name,
        description,
        trackGPX,
        surfaceType,
        isPublic: true,
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
