import { Types } from 'mongoose';
import slugify from 'slugify';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

import '@/database/mongodb/Models/RacePointsTable';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { Organizer as OrganizerModel } from '@/database/mongodb/Models/Organizer';
import { CategoriesModel } from '@/database/mongodb/Models/Categories';
import { RaceModel } from '@/database/mongodb/Models/Race';

import { saveFile } from './save-file';

import { organizerSelect, parentChampionshipSelect } from '@/constants/populate';
import { dtoChampionship, dtoChampionships, dtoToursAndSeries } from '@/dto/championship';
import { deserializeChampionship } from '@/libs/utils/deserialization/championship';
import { getNextSequenceValue } from './sequence';
import { Cloud } from './cloud';
import { fileNameFormUrl } from '@/constants/regex';
import { getCurrentStatus } from '@/libs/utils/championship/championship';
import { RegistrationChampService } from './RegistrationChamp';

import { DEFAULT_STANDARD_CATEGORIES } from '@/constants/championship';

// types
import type { TDtoChampionship, TToursAndSeriesDto } from '@/types/dto.types';
import type {
  ServerResponse,
  TAddCategoryConfigsIdsParams,
  TChampionshipForSave,
  TChampionshipWithOrganizer,
  TClientMeta,
  TGetChampUrlSlugParams,
  TGetParentChampionship,
  TSaveFile,
  TServiceEntity,
  TStageDateDescription,
} from '@/types/index.interface';
import type {
  TChampionshipDocument,
  TChampionshipStatus,
  TChampionshipTypes,
  TRace,
  TTrackGPXObj,
} from '@/types/models.interface';
import { TDeleteChampionshipFromMongo, TGetToursAndSeriesFromMongo } from '@/types/mongo.types';
import { ModeratorActionLogService } from './ModerationActionLog';
import { compareDates, getDateForCompare } from '@/libs/utils/date';
import { SiteServiceSlotService } from './SiteServiceSlotService';

/**
 * Класс работы с сущностью Чемпионат.
 */
export class ChampionshipService {
  private errorLogger;
  private handlerErrorDB;
  private saveFile: (params: TSaveFile) => Promise<string>; // eslint-disable-line no-unused-vars
  private suffixImagePoster: string;
  private getCurrentStatus: (props: {
    status: TChampionshipStatus;
    startDate: Date;
    endDate: Date;
  }) => TChampionshipStatus;
  private entity: TServiceEntity;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.saveFile = saveFile;
    this.suffixImagePoster = 'championship_image_poster-';
    this.getCurrentStatus = getCurrentStatus;
    this.entity = 'championship';
  }

  /**
   * Данные по запрашиваемому Чемпионату по urlSlug.
   */
  public async getOne({
    urlSlug,
  }: {
    urlSlug: string;
  }): Promise<ServerResponse<TDtoChampionship | null>> {
    try {
      const championshipDB = await ChampionshipModel.findOne({ urlSlug })
        .populate({
          path: 'organizer',
          select: organizerSelect,
        })
        .populate({
          path: 'parentChampionship',
          select: parentChampionshipSelect,
        })
        .populate('racePointsTable')
        .populate('categoriesConfigs')
        .populate({ path: 'races', populate: 'trackDistance' })
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
    organizerId,
    parentChampionshipId,
  }: {
    userIdDB?: string;
    forModeration?: boolean;
    needTypes?: TChampionshipTypes[];
    organizerId?: string;
    parentChampionshipId?: string;
  }): Promise<ServerResponse<TDtoChampionship[] | null>> {
    try {
      let query: any = {
        ...(needTypes && { type: needTypes }),
        ...(parentChampionshipId && { parentChampionship: parentChampionshipId }),
      };

      // Если запрос для модерации, значит необходимо вернуть Чемпионаты, созданные Организатором userIdDB, или их модераторами userIdDB.
      if (forModeration && userIdDB) {
        const organizer = await OrganizerModel.findOne(
          { $or: [{ creator: userIdDB }, { moderators: userIdDB }] },
          { _id: true }
        ).lean<{ _id: Types.ObjectId }>();

        if (!organizer) {
          throw new Error('У пользователя не создан Организатор!');
        }

        query = { organizer: organizer._id };
      }

      if (organizerId) {
        query.organizer = organizerId;
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
        .populate('racePointsTable')
        .populate('races')
        .lean<TChampionshipWithOrganizer[]>();

      // Формирование данных для отображение Блока Этапов в карточке Чемпионата.
      const championshipsWithDesc = await this.buildStageDateDescriptions(championshipsDB);

      // ДТО формирование данных для Клиента.
      const championships = dtoChampionships(championshipsWithDesc);

      // Сортировка 1 группа upcoming, ongoing сортируются по дате старта.
      // Далее сортировка 2 группы completed, canceled сортируются по дате финиша.
      const sortedChampionships = this.sortChampionships(championships);

      return {
        data: sortedChampionships,
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
    moderator,
  }: {
    serializedFormData: FormData;
    moderator: string;
  }): Promise<ServerResponse<null>> {
    try {
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
        stageOrder,
        awardedProtocols,
        isCountedStageInGC,
        requiredStage,
        client,
        startNumbers,
      } = deserializeChampionship(serializedFormData);

      // Проверка наличия слотов на создание чемпионата у модератора.
      const siteServiceSlotService = new SiteServiceSlotService();
      const availableSlots = await siteServiceSlotService.getAvailableSlots({
        userDBId: moderator,
        entityName: 'championship',
      });

      if (
        !availableSlots.data?.availableSlots?.totalAvailable ||
        availableSlots.data?.availableSlots?.totalAvailable === 0
      ) {
        throw new Error(
          `У вас нет слотов для создания чемпионата. Пользователь с _id:${moderator}`
        );
      }
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

      const urlSlug = await this.getUrlSlug({
        type,
        parentChampionshipId,
        champName: name,
      });

      const createData: Partial<TChampionshipForSave> = {
        name,
        description,
        startDate,
        endDate,
        type: type,
        bikeType,
        organizer: organizerId,
        posterUrl,
        awardedProtocols,
        isCountedStageInGC,
        requiredStage,
        urlSlug,
        startNumbers,
        ...(parentChampionshipId && {
          parentChampionship: parentChampionshipId,
        }),
        ...(quantityStages && { quantityStages }),
        ...(stageOrder && { stageOrder }),
      };

      // Создаём новый чемпионат на основе входных данных.
      const championshipCreated: TChampionshipDocument = await ChampionshipModel.create(
        createData
      );

      // Изменение слотов у пользователя на создание чемпионатов.
      // Обработка удачной покупки, зачисление слотов пользователю.
      // Слот списывается только при создании одиночного соревнования или этапа серии (тура).
      if (type === 'single' || type === 'stage') {
        await siteServiceSlotService.manageServiceSlots({
          user: moderator,
          metadata: { entityName: 'championship', quantity: 1 },
          actionSlot: 'consume',
        });
      }

      await this.addCategoryConfigsIds({ championshipCreated, type, parentChampionshipId });

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: moderator,
        changes: {
          description: `Создание чемпионата: "${championshipCreated.name}"`,
          params: {
            serializedFormData: 'Данные в формате FormData для создания чемпионата',
            moderator,
          },
        },
        action: 'create',
        entity: this.entity,
        entityIds: [championshipCreated._id.toString()],
        client,
      });

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
    moderator,
  }: {
    serializedFormData: FormData;
    moderator: string;
  }): Promise<ServerResponse<null>> {
    try {
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
        stageOrder,
        awardedProtocols,
        isCountedStageInGC,
        requiredStage,
        racePointsTable,
        client,
        startNumbers,
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

      // Внимание! Добавлять соответствующие обновляемые свойства Чемпионата в ручную.
      const updateData: Partial<TChampionshipForSave> = {
        name,
        description,
        startDate,
        endDate,
        bikeType,
        awardedProtocols,
        isCountedStageInGC,
        requiredStage,
        startNumbers,
        racePointsTable: racePointsTable || null,
        ...(posterUrl && { posterUrl }), // Обновление только если posterUrl не пуст
        ...(quantityStages && { quantityStages }),
        ...(parentChampionshipId && {
          parentChampionship: parentChampionshipId,
        }),
        ...(stageOrder && { stageOrder }),
      };

      await championshipDB.updateOne({ $set: { ...updateData } });

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: moderator,
        changes: {
          description: `Обновление данных чемпионата: "${championshipDB.name}"`,
          params: {
            serializedFormData:
              'Измененные данные в формате FormData для обновления данных чемпионата',
            moderator,
          },
        },
        action: 'update',
        entity: this.entity,
        entityIds: [championshipDB._id.toString()],
        client,
      });

      return { data: null, ok: true, message: 'Данные Чемпионата обновлены в БД!' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Удаление Чемпионата.
   */
  public async delete({
    urlSlug,
    moderator,
    client,
  }: {
    urlSlug: string;
    moderator: string;
    client: TClientMeta;
  }): Promise<ServerResponse<null>> {
    try {
      const championshipDB: TDeleteChampionshipFromMongo | null =
        await ChampionshipModel.findOne(
          { urlSlug },
          {
            status: true,
            name: true,
            posterUrl: true,
            races: true,
            type: true,
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

      // Получение заездов для удаления gpx треков с облака.
      const racesDB = await RaceModel.find({
        championship: championshipDB._id,
      }).lean<TRace[]>();

      // Удаление всех заездов Чемпионата.
      await RaceModel.deleteMany({ championship: championshipDB._id });

      // Удаление всех конфигураций категорий Чемпионата, только если это не Этап.
      if (championshipDB.type !== 'stage') {
        await CategoriesModel.deleteMany({ championship: championshipDB._id });
      }

      // Удаление всех этапов серии.
      // Удаление из облака постеров этапов серии.
      // Удаление всех заездов соответствующих этапов.
      // Удаление из облака gps треков соответствующих заездов.
      if (['series', 'tour'].includes(championshipDB.type)) {
        await this.deleteStages(championshipDB._id);
      }

      // Экземпляр сервиса работы с Облаком.
      const cloudService = new Cloud();

      // Удаление Постера с облака.
      cloudService
        .deleteFile({
          prefix: championshipDB.posterUrl.replace(fileNameFormUrl, '$1'),
        })
        .catch((error) => this.errorLogger(error));

      // Удаление GPX трека с облака.
      // без await, нет необходимости ждать результата выполнения каждого Промиса.
      for (const race of racesDB) {
        cloudService
          .deleteFile({
            prefix: race.trackGPX.url.replace(fileNameFormUrl, '$1'),
          })
          .catch((error) => this.errorLogger(error));
      }

      const siteServiceSlotService = new SiteServiceSlotService();
      // Изменение слотов у пользователя на создание чемпионатов.
      // Обработка удачной покупки, зачисление слотов пользователю.
      // Слот списывается только при создании одиночного соревнования или этапа серии (тура).
      if (championshipDB.type === 'single' || championshipDB.type === 'stage') {
        await siteServiceSlotService.manageServiceSlots({
          user: moderator,
          metadata: { entityName: 'championship', quantity: 1 },
          actionSlot: 'refund',
        });
      }

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: moderator,
        changes: {
          description: `Удаление чемпионата: "${championshipDB.name}"`,
          params: {
            urlSlug,
            moderator,
          },
        },
        action: 'delete',
        entity: this.entity,
        entityIds: [championshipDB._id.toString()],
        client,
      });

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
  public async updateStatusChampionship(): Promise<ServerResponse<null>> {
    try {
      const championshipsDB = await ChampionshipModel.find(
        {
          status: ['upcoming', 'ongoing'],
        },
        { _id: true, status: true, startDate: true, endDate: true, urlSlug: true }
      ).lean<
        {
          _id: Types.ObjectId;
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
  }): Promise<ServerResponse<TToursAndSeriesDto[] | null>> {
    try {
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

        const stageNumbersDB: { stageOrder: number | null }[] = await ChampionshipModel.find(
          {
            parentChampionship: camp._id,
          },
          { stage: true, _id: false }
        ).lean();

        const availableStage: number[] = [];

        for (let stage = 1; stage < camp.quantityStages + 1; stage++) {
          const isOccupiedStage = stageNumbersDB.find((elm) => elm.stageOrder === stage);

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
   * Добавление в чемпионат id конфигураций категорий.
   */
  private async addCategoryConfigsIds({
    type,
    parentChampionshipId,
    championshipCreated,
  }: TAddCategoryConfigsIdsParams): Promise<void> {
    if (type === 'stage') {
      // Для Этапа добавляется ids из родительского чемпионата.
      const parentChamp = await this.getParentChampionship(parentChampionshipId);

      championshipCreated.categoriesConfigs = parentChamp.categoriesConfigs;
    } else {
      // Создаём дефолтные категории и привязываем их к чемпионату.
      const categoriesCreated = await CategoriesModel.create({
        championship: championshipCreated._id,
        ...DEFAULT_STANDARD_CATEGORIES,
      });

      // Сохраняем ID созданных категорий в чемпионат (в поле categoriesConfigs).
      championshipCreated.categoriesConfigs = [categoriesCreated._id];
    }
    await championshipCreated.save();
  }

  /**
   * Создание urlSlug чемпионата.
   */
  private async getUrlSlug({
    type,
    champName,
    parentChampionshipId,
  }: TGetChampUrlSlugParams): Promise<string> {
    // urlSlug для этапа образуется путем конкатенации urlSlug родительского чемпионата и нормализованного названия этапа.
    if (type === 'stage') {
      const parentChamp = await this.getParentChampionship(parentChampionshipId);

      const normalizedSlug = slugify(champName, { lower: true, strict: true });
      return `${parentChamp.urlSlug}-${normalizedSlug}`;
    }

    const sequenceValue = await getNextSequenceValue('championship');
    const stringRaw = `${sequenceValue}-${champName}`;

    return slugify(stringRaw, { lower: true, strict: true });
  }

  /**
   * Данные родительского чемпионата для этапа.
   */
  private async getParentChampionship(
    parentChampionshipId: string | undefined
  ): Promise<TGetParentChampionship> {
    if (!parentChampionshipId) {
      throw new Error('При создании Этапа не получен id родительского Чемпионата!');
    }
    const champDB = await ChampionshipModel.findOne(
      { _id: parentChampionshipId },
      { categoriesConfigs: true, urlSlug: true, _id: false }
    ).lean<TGetParentChampionship>();

    if (!champDB) {
      throw new Error(
        'Не найден родительский чемпионат для этапа при добавлении конфигураций категорий в Этап!'
      );
    }

    return champDB;
  }

  /**
   * Удаление всех этапов и связанных с ними сущностей при удалении родительского чемпионата (series, tour).
   */
  private async deleteStages(championshipId: Types.ObjectId): Promise<void> {
    try {
      // Получение массива этапов с информацией о заездах в них.
      const stagesDB = await ChampionshipModel.find(
        { parentChampionship: championshipId },
        { races: true, posterUrl: true }
      )
        .populate({ path: 'races', select: ['trackGPX', '-_id'] })
        .lean<
          { posterUrl: string; races: { trackGPX: TTrackGPXObj }[]; _id: Types.ObjectId }[]
        >();

      if (stagesDB.length === 0) {
        return;
      }

      // Получение всех треков gps из заездов для удаления их из облака.
      const gpsTracks = stagesDB.flatMap((stage) => stage.races.map((race) => race.trackGPX));

      // Экземпляр сервиса работы с Облаком.
      const cloudService = new Cloud();

      // Удаление из облака gps треков соответствующих заездов.
      await Promise.allSettled(
        gpsTracks.map((gpsTrack) =>
          cloudService.deleteFile({
            prefix: gpsTrack.url.replace(fileNameFormUrl, '$1'),
          })
        )
      );

      // Удаление из облака постеров этапов серии.
      await Promise.allSettled(
        stagesDB.map(({ posterUrl }) =>
          cloudService.deleteFile({
            prefix: posterUrl.replace(fileNameFormUrl, '$1'),
          })
        )
      );

      // Удаление всех этапов серии (тура).
      await ChampionshipModel.deleteMany({ parentChampionship: championshipId });

      // Удаление всех заездов Чемпионата.
      const raceForDelIds = stagesDB.map((stage) => stage._id);

      await RaceModel.deleteMany({ championship: { $in: raceForDelIds } });
    } catch (error) {
      this.errorLogger(error);
    }
  }

  /**
   * Формирование данных для отображение Блока Этапов в карточке Чемпионата.
   */
  private async buildStageDateDescriptions(
    championships: TChampionshipWithOrganizer[]
  ): Promise<TChampionshipWithOrganizer[]> {
    return Promise.all(
      championships.map(async (champ) => {
        let stages: TStageDateDescription[];

        if (champ.type === 'tour' || champ.type === 'series') {
          stages = await ChampionshipModel.find(
            { parentChampionship: champ._id },
            {
              stageOrder: true,
              status: true,
              startDate: true,
              endDate: true,
              _id: false,
            }
          ).lean<TStageDateDescription[]>();

          stages.sort((a, b) => a.stageOrder - b.stageOrder);
        } else {
          stages = [
            {
              stageOrder: 1,
              status: champ.status,
              startDate: champ.startDate,
              endDate: champ.endDate,
            },
          ];
        }

        return {
          ...champ,
          stageDateDescription: stages,
        };
      })
    );
  }

  /**
   * Сортировка для отображения всех чемпионатов в расписании.
   * Сортировка 1 группа upcoming, ongoing сортируются по дате старта.
   * Далее сортировка 2 группы completed, canceled сортируются по дате финиша.
   */
  private sortChampionships(championships: TDtoChampionship[]): TDtoChampionship[] {
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

    const currentSortedChamps = sortedChamp.currentChamps.toSorted((a, b) => {
      return compareDates(getDateForCompare(a), getDateForCompare(b));
    });
    const finishedSortedChamps = sortedChamp.finishedChamps.toSorted((a, b) =>
      compareDates(b.endDate, a.endDate)
    );

    return [...currentSortedChamps, ...finishedSortedChamps];
  }

  /**
   * Получение списка модераторов чемпионата.
   */
  private async getModeratorIds(): Promise<string[]> {
    return [];
  }
}
