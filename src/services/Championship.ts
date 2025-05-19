import { ObjectId, Types } from 'mongoose';
import slugify from 'slugify';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { saveFile } from './save-file';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { organizerSelect, parentChampionshipSelect } from '@/constants/populate';
import { dtoChampionship, dtoChampionships, dtoToursAndSeries } from '@/dto/championship';
import type {
  ResponseServer,
  TChampionshipWithOrganizer,
  TRaceForFormDeserialized,
  TSaveFile,
  TStageDateDescription,
} from '@/types/index.interface';
import type {
  TChampionshipDocument,
  TChampionshipStatus,
  TChampionshipTypes,
  TRace,
  TTrackGPXObj,
} from '@/types/models.interface';
import type { TDtoChampionship, TToursAndSeriesDto } from '@/types/dto.types';
import { deserializeChampionship } from '@/libs/utils/deserialization/championship';
import { getNextSequenceValue } from './sequence';
import { parseGPX } from '@/libs/utils/parse-gpx';
import { getCoordStart } from '@/libs/utils/track';
import { Organizer as OrganizerModel } from '@/database/mongodb/Models/Organizer';
import { Cloud } from './cloud';
import { fileNameFormUrl } from '@/constants/regex';
import { getCurrentStatus } from '@/libs/utils/championship';
import { RegistrationChampService } from './RegistrationChamp';
import { TDeleteChampionshipFromMongo, TGetToursAndSeriesFromMongo } from '@/types/mongo.types';
import { CategoriesModel } from '@/database/mongodb/Models/Categories';
import { DEFAULT_STANDARD_CATEGORIES } from '@/constants/championship';
import { deserializeCategories } from '@/libs/utils/deserialization/categories';

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

  /**
   * Данные по запрашиваемому Чемпионату по urlSlug.
   */
  public async getOne({
    urlSlug,
  }: {
    urlSlug: string;
  }): Promise<ResponseServer<TDtoChampionship | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const championshipDB = await ChampionshipModel.findOne({ urlSlug })
        .populate({
          path: 'organizer',
          select: organizerSelect,
        })
        .populate({
          path: 'parentChampionship',
          select: parentChampionshipSelect,
        })
        .populate('categoriesConfigs')
        .lean<TChampionshipWithOrganizer>();

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
    userIdDB,
    forModeration,
    needTypes,
  }: {
    userIdDB?: string;
    forModeration?: boolean;
    needTypes?: TChampionshipTypes[];
  }): Promise<ResponseServer<TDtoChampionship[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      let query: any = { ...(needTypes && { type: needTypes }) };

      // Если запрос для модерации, значит необходимо вернуть Чемпионаты, созданные Организатором userIdDB, или их модераторами userIdDB.
      if (forModeration && userIdDB) {
        const organizer = await OrganizerModel.findOne(
          { $or: [{ creator: userIdDB }, { moderators: userIdDB }] },
          { _id: true }
        ).lean<{ _id: ObjectId }>();

        if (!organizer) {
          throw new Error('У пользователя не создан Организатор!');
        }

        query = { organizer: organizer._id };
      }

      // Получение Чемпионатов согласно запросу query.
      const championshipsDB = await ChampionshipModel.find(query)
        .populate({
          path: 'organizer',
          select: organizerSelect,
        })
        .populate({
          path: 'parentChampionship',
          select: parentChampionshipSelect,
        })
        .populate('categoriesConfigs')
        .lean<TChampionshipWithOrganizer[]>();

      // Формирование данных для отображение Блока Этапов в карточке Чемпионата.
      for (const champ of championshipsDB) {
        let stages: TStageDateDescription[] = [];

        // поиск Этапов к Турам и Сериям
        if (champ.type === 'tour' || champ.type === 'series') {
          stages = await ChampionshipModel.find(
            { parentChampionship: champ._id },
            { stage: true, status: true, startDate: true, endDate: true, _id: false }
          ).lean<TStageDateDescription[]>();
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

      // Сортировка 1 группа upcoming, ongoing сортируются по дате старта.
      // Далее сортировка 2 группы completed, canceled сортируются по дате финиша.
      const sortedChamp = championships.reduce(
        (acc, cur) => {
          if (['upcoming', 'ongoing'].includes(cur.status)) {
            acc.currentChamps.push(cur);
          } else {
            acc.finishedChamps.push(cur);
          }

          return acc;
        },
        {
          currentChamps: [] as TDtoChampionship[],
          finishedChamps: [] as TDtoChampionship[],
        }
      );

      sortedChamp.currentChamps.sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      sortedChamp.finishedChamps.sort(
        (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      );

      return {
        data: [...sortedChamp.currentChamps, ...sortedChamp.finishedChamps],
        ok: true,
        message: `Чемпионаты ${needTypes ? 'типов: ' + needTypes.join(', ') : 'все'}`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Создание нового Чемпионата (основные настройки, без заездов и категорий) по _id или по creatorId.
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
      // const racesForSave = await this.handleRacesInPost(races);

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
        ...(quantityStages && { quantityStages }),
        ...(stage && { stage }),
      };

      // Создаём новый чемпионат на основе входных данных.
      const championshipCreated = await ChampionshipModel.create(createData);

      // Создаём дефолтные категории и привязываем их к чемпионату.
      const categoriesCreated = await CategoriesModel.create({
        championship: championshipCreated._id,
        ...DEFAULT_STANDARD_CATEGORIES,
      });

      // Сохраняем ID созданных категорий в чемпионат (в поле categoriesConfigs).
      championshipCreated.categoriesConfigs = [categoriesCreated._id];
      await championshipCreated.save();

      return { data: null, ok: true, message: 'Чемпионат создан, данные сохранены в БД!' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновление пакетов категорий для чемпионата.
   * Приходит массив пакетов TCategories:
   * 1. Пакет по умолчанию у которого есть _id и он не изменяется и не удаляется (создается при создании чемпионата);
   * 2. Дополнительный(ые) пакеты категорий, если есть несколько заездов в Чемпионате с разными категориями.
   */
  async putCategories({
    dataSerialized,
    championshipId,
  }: {
    dataSerialized: FormData;
    championshipId: string;
  }): Promise<ResponseServer<null>> {
    try {
      const categoriesConfigs = deserializeCategories(dataSerialized);

      // Проверка на дубликаты названий пакетов категорий.
      this.validateUniqueCategoryNames(categoriesConfigs);

      // Получаем все существующие пакеты категорий (кроме 'default') для текущего чемпионата.
      const oldCategories = await CategoriesModel.find(
        { championship: championshipId, name: { $ne: 'default' } },
        { _id: true }
      ).lean<{ _id: Types.ObjectId }[]>();

      // Сохраняем _id обновлённых пакетов.
      const updatedIds = new Set<string>();

      for (const config of categoriesConfigs) {
        if (config._id) {
          // Обновляем существующий пакет по _id.
          await CategoriesModel.updateOne(
            { _id: config._id },
            {
              $set: {
                ...config,
                championship: championshipId,
              },
            }
          );
          updatedIds.add(config._id); // Добавляем _id в список обновлённых.
        } else {
          // Создаём новый пакет, если _id нет.
          const created = await CategoriesModel.create({
            ...config,
            championship: championshipId,
          });
          updatedIds.add(created._id.toString()); // Добавляем созданный _id.
        }
      }

      // Обновление categoriesConfigs в Чемпионате.
      await ChampionshipModel.findOneAndUpdate({
        _id: championshipId,
        categoriesConfigs: [...updatedIds],
      });

      // Удаляем те пакеты, _id которых не было среди обновлённых.
      const toDelete = oldCategories.filter((cat) => !updatedIds.has(cat._id.toString()));

      if (toDelete.length > 0) {
        await CategoriesModel.deleteMany({
          _id: { $in: toDelete.map((c) => c._id) },
        });
      }

      return { data: null, ok: true, message: 'Пакеты категорий успешно обновлены.' };
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
      const racesForSave = await this.handleRacesInPut({
        races,
        racesFromDB: championshipDB.races,
        cloud,
        urlTracksForDel,
      });

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

      const championshipDB: TDeleteChampionshipFromMongo | null =
        await ChampionshipModel.findOne(
          { urlSlug },
          {
            status: true,
            name: true,
            posterUrl: true,
            races: true,
            categoriesConfigs: true,
          }
        );

      if (!championshipDB) {
        throw new Error(`Не найден Чемпионат с urlSlug: ${urlSlug} в БД!`);
      }

      // Удаление документа Чемпионат/
      await championshipDB.deleteOne();

      // Удаление документов регистрации райдеров, зарегистрированных на удаляемый Чемпионат.
      const regService = new RegistrationChampService();
      await regService.deleteMany({ champId: String(championshipDB._id) });

      // Экземпляр сервиса работы с Облаком.
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

      // Удаление пакетов категорий.
      await CategoriesModel.deleteMany({ _id: championshipDB.categoriesConfigs });

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

      const championshipsDB = await ChampionshipModel.find(
        {
          status: ['upcoming', 'ongoing'],
        },
        { _id: true, status: true, startDate: true, endDate: true, urlSlug: true }
      ).lean<
        {
          _id: ObjectId;
          status: TChampionshipStatus;
          startDate: Date;
          endDate: Date;
          urlSlug: string;
        }[]
      >();

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
   * Получение всех Туров и Серий у Организатора.
   */
  public async getToursAndSeries({
    organizerId,
  }: {
    organizerId: string;
  }): Promise<ResponseServer<TToursAndSeriesDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();
      console.log('started');

      const championshipsDB = await ChampionshipModel.find(
        {
          organizer: organizerId,
          type: ['series', 'tour'],
        },
        { name: true, quantityStages: true, startDate: true, endDate: true }
      ).lean<TGetToursAndSeriesFromMongo[]>();

      const championshipsWithAvailableStageNumber: (TGetToursAndSeriesFromMongo & {
        availableStage: number[];
      })[] = [];

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
   * Обработка данных races при создании Чемпионата (Этапов).
   */
  private handleRacesInPost = async (races: TRaceForFormDeserialized[]): Promise<TRace[]> => {
    const racesForSave = [] as TRace[];

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

        // Сохранение пакета категорий в БД,

        raceForSave.number = race.number;
        raceForSave.name = race.name;
        raceForSave.description = race.description;
        raceForSave.laps = race.laps;
        raceForSave.distance = race.distance;
        raceForSave.ascent = race.ascent;
        raceForSave.categories = new Types.ObjectId(race.categoriesId);
        raceForSave.trackGPX = trackGPX;

        racesForSave.push(raceForSave);
      }
    }

    return racesForSave;
  };

  /**
   * Обработка данных races при редактировании Чемпионата (Этапов).
   */
  private handleRacesInPut = async ({
    races,
    racesFromDB,
    cloud,
    urlTracksForDel,
  }: {
    races: TRaceForFormDeserialized[];
    racesFromDB: TRace[];
    cloud: Cloud;
    urlTracksForDel: string[];
  }): Promise<
    Omit<TRace, 'registeredRiders'> &
      {
        registeredRiders: string[];
      }[]
  > => {
    const racesForSave = [] as unknown as Omit<TRace, 'registeredRiders'> &
      {
        registeredRiders: string[];
      }[];

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

          const raceForSave = {} as Omit<TRace, 'registeredRiders'> & {
            registeredRiders: string[];
          };
          raceForSave.trackGPX = trackGPX;
          raceForSave.number = race.number;
          raceForSave.name = race.name;
          raceForSave.description = race.description;
          raceForSave.laps = race.laps;
          raceForSave.distance = race.distance;
          raceForSave.ascent = race.ascent;
          raceForSave.registeredRiders = race.registeredRiders;
          raceForSave.categories = new Types.ObjectId(race.categoriesId);

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
          const raceWithoutChangedTrack = racesFromDB.find((elm) => elm.number === race.number);

          // trackGPXUrl чтобы удалить с Облака.
          if (raceWithoutChangedTrack) {
            const raceForSave = {} as Omit<TRace, 'registeredRiders'> & {
              registeredRiders: string[];
            };
            raceForSave.trackGPX = raceWithoutChangedTrack.trackGPX;
            raceForSave.number = race.number;
            raceForSave.name = race.name;
            raceForSave.description = race.description;
            raceForSave.laps = race.laps;
            raceForSave.distance = race.distance;
            raceForSave.ascent = race.ascent;
            raceForSave.registeredRiders = race.registeredRiders;
            raceForSave.categories = new Types.ObjectId(race.categoriesId);

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

    return racesForSave;
  };

  /**
   * Проверяет уникальность названий пакетов категорий.
   * @param categoriesConfigs Массив конфигураций категорий.
   */
  private validateUniqueCategoryNames(categoriesConfigs: Array<{ name: string }>): void {
    const names = new Set<string>();

    for (const config of categoriesConfigs) {
      if (names.has(config.name)) {
        throw new Error(
          `Название пакета категорий должно быть уникальным. Дублируется название: "${config.name}"`
        );
      }
      names.add(config.name);
    }
  }
}
