import { Types } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

import { saveFile } from './save-file';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { parseGPX } from '@/libs/utils/parse-gpx';
import { getCoordStart } from '@/libs/utils/track';
import { Cloud } from './cloud';
import { fileNameFormUrl } from '@/constants/regex';
import { deserializeRaces } from '@/libs/utils/deserialization/championshipRaces';
import { RaceModel } from '@/database/mongodb/Models/Race';

// types
import type { ServerResponse, TSaveFile, TServiceEntity } from '@/types/index.interface';
import type { TTrackGPXObj } from '@/types/models.interface';
import { ModeratorActionLogService } from './ModerationActionLog';

/**
 * Класс работы с сущностью Заезды чемпионата.
 */
export class ChampionshipRaces {
  private errorLogger;
  private handlerErrorDB;
  private entity: TServiceEntity;

  private saveFile: (params: TSaveFile) => Promise<string>;
  private suffixTrackGpx: string;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.entity = 'championshipRaces';

    this.saveFile = saveFile;
    this.suffixTrackGpx = 'championship_track_gpx-';
  }

  /**
   * Метод обновления заездов в Чемпионате. Данные из формы с клиента.
   */
  public async updateAll({
    dataSerialized,
    championshipId,
    moderator,
  }: {
    dataSerialized: FormData;
    championshipId: string;
    moderator: string;
  }): Promise<ServerResponse<null>> {
    try {
      const { races, client } = deserializeRaces(dataSerialized);

      const oldRaces = await this.getOldRaces(championshipId);
      const updatedIds = new Set<string>();

      for (const race of races) {
        const { updatedId } = await this.processRace(race, championshipId);

        updatedIds.add(updatedId);
      }

      //  Обновление списка заездов в чемпионате.
      await this.updateChampionshipRaces(championshipId, updatedIds);

      await this.cleanupDeletedRaces(oldRaces, updatedIds);

      // Получение название чемпионата для логирования действий модератора.
      const champDB = await ChampionshipModel.findById(championshipId, {
        _id: false,
        name: true,
      }).lean();

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: moderator,
        changes: {
          description: `Изменение данных всех заездов в чемпионате: "${champDB?.name}"`,
          params: {
            dataSerialized,
            championshipId,
            moderator,
          },
        },
        action: 'update',
        entity: this.entity,
        entityIds: [...updatedIds],
        client,
      });

      return { data: null, ok: true, message: 'Заезды успешно обновлены.' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение старых заездов чемпионата
   */
  private async getOldRaces(championshipId: string) {
    return await RaceModel.find(
      { championship: championshipId },
      { _id: true, trackGPX: true }
    ).lean<{ _id: Types.ObjectId; trackGPX: TTrackGPXObj }[]>();
  }

  /**
   * Обработка одного заезда (создание или обновление)
   */
  private async processRace(
    race: any,
    championshipId: string
  ): Promise<{ updatedId: string; trackUrlForDeletion?: string }> {
    if (race._id) {
      await this.updateExistingRace(race, championshipId);
      return { updatedId: race._id };
    } else {
      const created = await this.createNewRace(race, championshipId);
      return { updatedId: created._id.toString() };
    }
  }

  /**
   * Обработка GPX трека
   */
  private async processTrackGPX(
    file: File,
    oldUrl?: string
  ): Promise<{ trackGPX: TTrackGPXObj; oldUrl?: string }> {
    const trackGPXUrl = await this.saveFile({
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

  /**
   * Обновление существующего заезда.
   */
  private async updateExistingRace(race: any, championshipId: string): Promise<void> {
    const updateData = {
      ...race,
      championship: championshipId,
    };

    await RaceModel.updateOne({ _id: race._id }, { $set: updateData });
  }

  /**
   * Создание нового заезда
   */
  private async createNewRace(
    race: any,
    championshipId: string
  ): Promise<{ _id: Types.ObjectId }> {
    return await RaceModel.create({
      ...race,
      championship: championshipId,
    });
  }

  /**
   * Обновление списка заездов в чемпионате.
   */
  private async updateChampionshipRaces(
    championshipId: string,
    updatedIds: Set<string>
  ): Promise<void> {
    await ChampionshipModel.findByIdAndUpdate(championshipId, {
      $set: { races: [...updatedIds] },
    });
  }

  /**
   * Удаление заездов, которых нет в обновленных данных.
   */
  private async cleanupDeletedRaces(
    oldRaces: { _id: Types.ObjectId; trackGPX: TTrackGPXObj }[],
    updatedIds: Set<string>
  ): Promise<void> {
    const toDelete = oldRaces.filter((race) => !updatedIds.has(race._id.toString()));

    if (toDelete.length > 0) {
      await RaceModel.deleteMany({
        _id: { $in: toDelete.map((c) => c._id) },
      });
    }
  }

  /**
   * Удаление теков из облака, которые были заменены в заезде, или которые были в удалённом заезде.
   */
  private async deleteOldTracks(urlTracksForDel: string[]): Promise<void> {
    try {
      const cloud = new Cloud();
      urlTracksForDel.forEach((url) => {
        cloud.deleteFile({
          prefix: url.replace(fileNameFormUrl, '$1'),
        });
      });
    } catch (error) {
      this.errorLogger(error);
      this.handlerErrorDB(error);
    }
  }
}
