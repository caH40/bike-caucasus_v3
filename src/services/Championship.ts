import { Document, ObjectId } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { saveFile } from './save-file';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { organizerSelect, parentChampionshipSelect } from '@/constants/populate';
import {
  dtoChampionship,
  dtoChampionships,
  dtoRegisteredRiders,
  dtoToursAndSeries,
} from '@/dto/championship';
import type {
  ResponseServer,
  TChampionshipWithOrganizer,
  TOrganizerPublic,
  TParentChampionship,
  TRegisteredRiderFromDB,
  TSaveFile,
  TStageDateDescription,
} from '@/types/index.interface';
import type {
  TChampionship,
  TChampionshipDocument,
  TChampionshipStatus,
  TChampionshipTypes,
  TRace,
  TTrackGPXObj,
} from '@/types/models.interface';
import type { TDtoChampionship, TRaceRegistrationDto } from '@/types/dto.types';
import { deserializeChampionship } from '@/libs/utils/deserialization/championship';
import { getNextSequenceValue } from './sequence';
import slugify from 'slugify';
import { parseGPX } from '@/libs/utils/parse-gpx';
import { getCoordStart } from '@/libs/utils/track';
import { Organizer as OrganizerModel } from '@/database/mongodb/Models/Organizer';
import { Cloud } from './cloud';
import { fileNameFormUrl } from '@/constants/regex';
import { getCurrentStatus } from '@/libs/utils/championship';
import { RaceRegistrationModel } from '@/database/mongodb/Models/Registration';

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
  private getCurrentStatus: ({
    /* eslint-disable no-unused-vars */
    status,
    startDate,
    endDate,
  }: /* eslint-enable no-unused-vars */
  {
    status: TChampionshipStatus;
    startDate: Date;
    endDate: Date;
  }) => TChampionshipStatus;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.dbConnection = connectToMongo;
    this.saveFile = saveFile;
    this.suffixImagePoster = 'championship_image_poster-';
    this.suffixTrackGpx = 'championship_track_gpx-';
    this.getCurrentStatus = getCurrentStatus;
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
        .populate({
          path: 'parentChampionship',
          select: parentChampionshipSelect,
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
    needTypes,
  }: {
    idUserDB?: string;
    forModeration?: boolean;
    needTypes?: TChampionshipTypes[];
  }): Promise<ResponseServer<TDtoChampionship[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      let query: any = { ...(needTypes && { type: needTypes }) };

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

      // Получение Чемпионатов согласно запросу query.
      const championshipsDB: (Omit<TChampionship, 'organizer'> & {
        organizer: TOrganizerPublic;
        parentChampionship: TParentChampionship;
        stageDateDescription: TStageDateDescription[];
      })[] = await ChampionshipModel.find(query)
        .populate({
          path: 'organizer',
          select: organizerSelect,
        })
        .populate({
          path: 'parentChampionship',
          select: parentChampionshipSelect,
        })
        .lean();

      // Формирование данных для отображение Блока Этапов в карточке Чемпионата.
      for (const champ of championshipsDB) {
        let stages: TStageDateDescription[] = [];

        if (champ.type === 'tour' || champ.type === 'series') {
          stages = await ChampionshipModel.find(
            { parentChampionship: champ._id },
            { stage: true, status: true, startDate: true, endDate: true, _id: false }
          ).lean();
          stages.sort((a, b) => a.stage - b.stage);
        } else {
          stages = [
            {
              stage: 1,
              status: champ.status,
              startDate: champ.startDate,
              endDate: champ.endDate,
            },
          ];
        }

        champ.stageDateDescription = stages;
      }
      // }

      // ДТО формирование данных для Клиента.
      const championships = dtoChampionships(championshipsDB);

      return {
        data: championships,
        ok: true,
        message: `Чемпионаты ${needTypes ? 'типов: ' + needTypes.join(', ') : 'все'}`,
      };
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
        name,
        description,
        startDate,
        endDate,
        type,
        bikeType,
        organizerId,
        parentChampionshipId,
        quantityStages,
        stage,
        races,
      } = deserializeChampionship(serializedFormData);

      // Проверка на дубликат названия Чемпионата.
      const championshipDuplicate = await ChampionshipModel.findOne(
        { name },
        { _id: true }
      ).lean();
      if (championshipDuplicate) {
        throw new Error(
          `Чемпионат с названием "${name}" уже существует! Придумайте уникальное название.`
        );
      }

      // Сохранение изображения для Постера Чемпионата.
      const posterUrl = await this.saveFile({
        file: posterFile as File,
        type: 'image',
        suffix: this.suffixImagePoster,
      });

      // Обработка данных Заездов (дистанций).
      const racesForSave: TRace[] = [];
      if (races) {
        for (const race of races) {
          let trackGPX = {} as TTrackGPXObj;
          const raceForSave = {} as TRace;
          // Сохранение GPX трека маршрута заезда (гонки) для Чемпионата.
          const trackGPXUrl = await this.saveFile({
            file: race.trackGPXFile as File,
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

          raceForSave.number = race.number;
          raceForSave.name = race.name;
          raceForSave.description = race.description;
          raceForSave.laps = race.laps;
          raceForSave.distance = race.distance;
          raceForSave.ascent = race.ascent;
          raceForSave.trackGPX = trackGPX;

          racesForSave.push(raceForSave);
        }
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
        ...(races && { races: racesForSave }),
        ...(quantityStages && { quantityStages }),
        ...(stage && { stage }),
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
        name,
        description,
        startDate,
        endDate,
        bikeType,
        parentChampionshipId,
        quantityStages,
        stage,
        races,
        urlTracksForDel,
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

      // Обработка данных Заездов (дистанций).
      const racesForSave: TRace[] = [];
      if (races) {
        for (const race of races) {
          // Если race.trackGPXFile существует, значит трек изменялся.
          if (race.trackGPXFile) {
            // Сохранение GPX трека маршрута заезда (гонки) для Чемпионата.
            const trackGPXUrl = await this.saveFile({
              file: race.trackGPXFile as File,
              type: 'GPX',
              suffix: this.suffixTrackGpx,
            });

            // Получаем файл GPX с облака, так как реализация через FileReader большая!
            const gpxParsed = await parseGPX(trackGPXUrl);

            const coordStart = getCoordStart(gpxParsed.gpx.trk[0].trkseg[0].trkpt[0]);

            const trackGPX = {
              url: trackGPXUrl,
              coordStart,
            };

            const raceForSave = {} as TRace;
            raceForSave.trackGPX = trackGPX;
            raceForSave.number = race.number;
            raceForSave.name = race.name;
            raceForSave.description = race.description;
            raceForSave.laps = race.laps;
            raceForSave.distance = race.distance;
            raceForSave.ascent = race.ascent;

            racesForSave.push(raceForSave);

            // Удаление старого GPX трек из облака.
            cloud.deleteFile({
              prefix: race.trackGPXUrl?.replace(fileNameFormUrl, '$1'),
            });
          } else {
            // Если race.trackGPXFile нет в объекте,пришедшем из формы клиента,
            // то находим его в обновляемом документе championshipDB,
            // если такой race не найден, значит race.number не существует,
            // то есть данный рейс был удален в форме на клиенте.
            const raceWithoutChangedTrack = championshipDB.races.find(
              (elm) => elm.number === race.number
            );

            // trackGPXUrl чтобы удалить с Облака.
            if (raceWithoutChangedTrack) {
              const raceForSave = {} as TRace;
              raceForSave.trackGPX = raceWithoutChangedTrack.trackGPX;
              raceForSave.number = race.number;
              raceForSave.name = race.name;
              raceForSave.description = race.description;
              raceForSave.laps = race.laps;
              raceForSave.distance = race.distance;
              raceForSave.ascent = race.ascent;

              racesForSave.push(raceForSave);
            }
          }
        }

        // Удаление файлов трека с облака, если были удалены блоки Заездов.
        if (urlTracksForDel) {
          urlTracksForDel.forEach((url) => {
            cloud.deleteFile({
              prefix: url.replace(fileNameFormUrl, '$1'),
            });
          });
        }
      }

      // Внимание! Добавлять соответствующие обновляемые свойства Чемпионата в ручную.
      const updateData: any = {
        name,
        description,
        startDate,
        endDate,
        bikeType,
        ...(races && { races: racesForSave }), // Обновление только если races не null
        ...(posterUrl && { posterUrl }), // Обновление только если posterUrl не пуст
        ...(quantityStages && { quantityStages }),
        ...(parentChampionshipId && {
          parentChampionship: parentChampionshipId,
        }),
        ...(stage && { stage }),
      };

      await championshipDB.updateOne({ $set: { ...updateData } });

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
            races: TRace[];
          } & Document)
        | null = await ChampionshipModel.findOne(
        { urlSlug },
        {
          status: true,
          name: true,
          posterUrl: true,
          races: true,
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
      if (championshipDB.races) {
        // без await, нет необходимости ждать результата выполнения каждого Промиса.
        for (const race of championshipDB.races) {
          cloudService.deleteFile({
            prefix: race.trackGPX.url.replace(fileNameFormUrl, '$1'),
          });
        }
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
   * Обновление статуса чемпионата.
   * Скрипт запускает с периодичностью раз в сутки в 01:00.
   * И при создании или обновлении данных Чемпионата.
   */
  public async updateStatusChampionship(): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const championshipsDB: {
        _id: ObjectId;
        status: TChampionshipStatus;
        startDate: Date;
        endDate: Date;
        urlSlug: string;
      }[] = await ChampionshipModel.find(
        {
          status: ['upcoming', 'ongoing'],
        },
        { _id: true, status: true, startDate: true, endDate: true, urlSlug: true }
      ).lean();

      // Подготовка данных для пакетного обновления
      const bulkOps = championshipsDB.map((champ) => {
        const currentStatus = this.getCurrentStatus({
          status: champ.status,
          startDate: champ.startDate,
          endDate: champ.endDate,
        });

        return {
          updateOne: {
            filter: { _id: champ._id },
            update: { $set: { status: currentStatus } },
          },
        };
      });

      await ChampionshipModel.bulkWrite(bulkOps);

      return {
        data: null,
        ok: true,
        message: `Обновление статусов Чемпионатов которые не завершились.`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение всех Туров и Серий у Организатора..
   */
  public async getToursAndSeries({
    organizerId,
  }: {
    organizerId: string;
  }): Promise<
    ResponseServer<{ _id: string; name: string; availableStage: number[] }[] | null>
  > {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const championshipsDB: {
        _id: ObjectId;
        name: string;
        quantityStages: number | null;
      }[] = await ChampionshipModel.find(
        {
          organizer: organizerId,
          type: ['series', 'tour'],
        },
        { name: true, quantityStages: true }
      ).lean();

      const championshipsWithAvailableStageNumber: {
        _id: ObjectId;
        name: string;
        quantityStages: number | null;
        availableStage: number[];
      }[] = [];

      for (const camp of championshipsDB) {
        // Если вдруг у Тура или Серии не указано количество Этапов.
        if (!camp.quantityStages) {
          continue;
        }

        const stageNumbersDB: { stage: number | null }[] = await ChampionshipModel.find(
          {
            parentChampionship: camp._id,
          },
          { stage: true, _id: false }
        ).lean();

        const availableStage: number[] = [];

        for (let stage = 1; stage < camp.quantityStages + 1; stage++) {
          const isOccupiedStage = stageNumbersDB.find((elm) => elm.stage === stage);

          // Занятый номер Этапа не добавляется в возвращаемый массив.
          if (!isOccupiedStage) {
            availableStage.push(stage);
          }
        }
        championshipsWithAvailableStageNumber.push({ ...camp, availableStage });
      }

      return {
        data: dtoToursAndSeries(championshipsWithAvailableStageNumber),
        ok: true,
        message: `Список Серий и Туров.`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Регистрация Райдера на Чемпионат.
   */
  public async register({
    championshipId,
    raceNumber,
    riderId,
    startNumber,
    teamVariable,
  }: {
    championshipId: string;
    raceNumber: number;
    riderId: string;
    startNumber: number;
    teamVariable?: string;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Проверка существования Чемпионата и запрашиваемого заезда для регистрации.
      const champ: { _id: ObjectId; name: string; races: TRace[] } | null =
        await ChampionshipModel.findOne(
          {
            _id: championshipId,
            'races.number': raceNumber,
          },
          { races: true, name: true }
        );

      if (!champ) {
        throw new Error('Не найден Чемпионат с Заездом!');
      }

      // Проверка зарегистрирован ли уже регистрирующийся райдер в данном Соревновании/Этапе.
      // Можно регистрироваться только в один заезд на Соревновании/Этапе.
      const checkRegistrationStatus: { raceNumber: number } | null =
        await RaceRegistrationModel.findOne(
          {
            championship: championshipId,
            rider: riderId,
          },
          { _id: false, raceNumber: true }
        ).lean();

      if (checkRegistrationStatus) {
        const raceName = champ.races.find(
          (race) => race.number === checkRegistrationStatus.raceNumber
        )?.name;
        throw new Error(`Вы уже зарегистрированы в данном Чемпионате, в заезде: ${raceName}!`);
      }

      // Проверка занят ли выбранный стартовый номер для заезда.
      const checkStartNumber = await RaceRegistrationModel.findOne({
        championship: championshipId,
        startNumber,
        raceNumber,
      });

      if (checkStartNumber) {
        throw new Error(`Стартовый номер: ${startNumber} уже занят!`);
      }

      // Регистрация на выбранный Заезд Чемпионата.
      await RaceRegistrationModel.create({
        championship: championshipId,
        rider: riderId,
        raceNumber,
        startNumber,
        status: 'registered',
        ...(teamVariable && { teamVariable }),
      });

      const messageSuccess = `Вы зарегистрировались, Чемпионат: ${champ.name}, заезд: "${
        champ.races.find((race) => race.number === raceNumber)?.name || '!нет названия!'
      }", стартовый номер: ${startNumber}`;

      return {
        data: null,
        ok: true,
        message: messageSuccess,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение зарегистрированных Райдеров в Заезде (Race) Чемпионата.
   */
  public async getRegisteredRiders({
    championshipId,
    raceNumber,
  }: {
    championshipId: string;
    raceNumber: number;
  }): Promise<ResponseServer<TRaceRegistrationDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const registeredRidersDb: TRegisteredRiderFromDB[] = await RaceRegistrationModel.find(
        {
          championship: championshipId,
          raceNumber,
        },
        { championship: false, payment: false }
      )
        .populate({
          path: 'rider',
          select: [
            'city',
            'team',
            'teamVariable',
            'person.firstName',
            'person.lastName',
            'person.birthday',
            'person.gender',
          ],
        })
        .lean();

      const registeredRiders = dtoRegisteredRiders(registeredRidersDb);

      return {
        data: registeredRiders,
        ok: true,
        message: `Вы зарегистрировались`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
