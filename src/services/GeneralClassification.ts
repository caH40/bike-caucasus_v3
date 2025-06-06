import { Types } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { ResultRaceModel } from '@/database/mongodb/Models/ResultRace';

// types
import {
  TGCStagesResultsFromMongo,
  TGetOneGeneralClassificationFromMongo,
  TGetStagesFromMongo,
} from '@/types/mongo.types';
import {
  ServerResponse,
  TGeneralClassificationResults,
  TGetOneGeneralClassificationService,
  TInitGeneralClassificationResults,
  TInitGeneralClassificationResultsParams,
  TStagesForGCTableHeader,
} from '@/types/index.interface';
import { TChampionshipTypes, TPoints } from '@/types/models.interface';
import { getCurrentCategoryName } from '@/libs/utils/results';
import { createCategoriesInRace, setGCPositions } from '@/libs/utils/gc-results';
import { GeneralClassificationModel } from '@/database/mongodb/Models/GeneralClassification';
import { generalClassificationDto } from '@/dto/general-classification';

/**
 * Класс работы с генеральной классификацией серии заездов и туров.
 */
export class GeneralClassificationService {
  private errorLogger;
  private handlerErrorDB;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

  /**
   * Получение данных генеральной классификацией по urlSlug родительского чемпионата (urlSlug - Серии или тура).
   */
  public async getOne({
    urlSlug,
  }: {
    urlSlug: string;
  }): Promise<ServerResponse<TGetOneGeneralClassificationService | null>> {
    try {
      // Данные чемпионата.
      const champ = await this.getChampionship({ urlSlug });

      const gcsDB = await GeneralClassificationModel.find({
        championship: champ._id,
      })
        .populate({
          path: 'rider',
          select: ['id', 'image', 'imageFromProvider', 'provider.image', '-_id'],
        })
        .lean<TGetOneGeneralClassificationFromMongo[]>();

      const gcAfterDto = gcsDB.map((gc) => generalClassificationDto(gc));

      // Получение всех этапов серии.
      const stages = await this.getStages(champ._id);

      const stagesForHeader: TStagesForGCTableHeader[] = stages
        .map((s) => ({
          _id: s._id.toString(),
          name: s.name,
          urlSlug: s.urlSlug,
          stageOrder: s.stageOrder,
        }))
        .sort((a, b) => a.stageOrder - b.stageOrder);

      return {
        data: { generalClassification: gcAfterDto, stages: stagesForHeader },
        ok: true,
        message: 'Генеральная классификация Серии заездов.',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   *  Создание или обновление генеральной классификацией по _id родительского чемпионата - championshipId.
   */
  public async upsert({
    championshipId,
  }: {
    championshipId: string;
  }): Promise<ServerResponse<null>> {
    try {
      // Данные чемпионата.
      const champ = await this.getChampionship({ championshipId });

      if (!champ.racePointsTable) {
        throw new Error('Не выбрана Таблица начисления очков за этапы!');
      }

      // Получение всех этапов серии.
      const stages = await this.getStages(championshipId);

      // Для каждого этапа получение результатов заездов
      // FIXME: на каждом из этапов может быть несколько заездов. Продумать логику их расчета.
      const stageIds = stages.map(({ _id }) => _id);
      const stagesResults = await this.getStageResults(stageIds);

      // Уникальные _id райдеров, участвовавших в заездах у которых есть финишный результат.
      const riderIds = new Set(
        stagesResults
          .map(({ rider }) => rider && rider.toString())
          .filter((r): r is string => r !== undefined)
      );

      // Формирования массива результатов генеральной классификации для райдеров, без подсчета итоговых данных.
      const initialGeneralClassification = this.initGeneralClassificationResults({
        riderIds,
        stagesResults,
        stages,
      });

      const gcWithTotals = this.calculateTotals(initialGeneralClassification);

      this.calculateSeriesPositions(gcWithTotals);

      await GeneralClassificationModel.deleteMany({
        championship: championshipId,
      });

      await GeneralClassificationModel.insertMany(gcWithTotals);

      return {
        data: null,
        ok: true,
        message: 'Данные таблицы начисления очков в заездах для Series',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Расчет позиции в генеральной классификации.
   * TODO: необходима логика определения места с учетом disqualification (пройдены ли все обязательные этапы для ГК).
   */
  private calculateSeriesPositions(generalClassification: TGeneralClassificationResults[]) {
    // Создание счетчиков мест по всем протоколам.
    const categoriesInRace = createCategoriesInRace(generalClassification);

    // Сортировка по очкам для абсолютного протокола.
    generalClassification.sort((a, b) => {
      const aPoints = a.totalFinishPoints?.absolute || 0;
      const bPoints = b.totalFinishPoints?.absolute || 0;
      return bPoints - aPoints;
    });

    for (const gc of generalClassification) {
      // Места в абсолютном протоколе.
      gc.positions.absolute = categoriesInRace.get('absolute')!;
      categoriesInRace.set('absolute', gc.positions.absolute + 1);
    }

    // Сортировка по очкам для абсолютного протокола по полу.
    generalClassification.sort((a, b) => {
      const aPoints = a.totalFinishPoints?.absoluteGender || 0;
      const bPoints = b.totalFinishPoints?.absoluteGender || 0;
      return bPoints - aPoints;
    });

    for (const gc of generalClassification) {
      // Места в absoluteGender.
      const isFemale = gc.profile.gender === 'female';
      if (isFemale) {
        gc.positions.absoluteGender = categoriesInRace.get('absoluteFemale')!;
        categoriesInRace.set('absoluteFemale', gc.positions.absoluteGender + 1);
      } else {
        gc.positions.absoluteGender = categoriesInRace.get('absoluteMale')!;
        categoriesInRace.set('absoluteMale', gc.positions.absoluteGender + 1);
      }
    }

    // Сортировка по очкам для абсолютного протокола по полу.
    generalClassification.sort((a, b) => {
      const aPoints = a.totalFinishPoints?.category || 0;
      const bPoints = b.totalFinishPoints?.category || 0;
      return bPoints - aPoints;
    });

    for (const gc of generalClassification) {
      const currentCategoryName = getCurrentCategoryName({
        gender: gc.profile.gender,
        rawSkillLevelName: gc.categorySkillLevel,
        ageCategoryName: gc.categoryAge,
      });

      // Места в absoluteGender.
      const positionInCategory = categoriesInRace.get(currentCategoryName);
      if (positionInCategory) {
        gc.positions.category = positionInCategory;
        categoriesInRace.set(currentCategoryName, positionInCategory + 1);
      }
    }
  }

  /**
   * Расчет позиции в генеральной классификации в зависимости от типа чемпионата .
   * TODO: необходима логика определения места с учетом disqualification (пройдены ли все обязательные этапы для ГК).
   */
  private setTourPositions(generalClassification: TGeneralClassificationResults[]): void {
    // Сортировка общему времени.

    const categoriesInRace = createCategoriesInRace(generalClassification);

    for (const gc of generalClassification) {
      setGCPositions(gc, categoriesInRace);
    }
  }

  /**
   * Расчет общего времени прохождения всех этапов и суммарное количество очков за этапы.
   * TODO: необходима логика определения disqualification.
   */
  private calculateTotals(
    initialGeneralClassification: TInitGeneralClassificationResults[]
  ): TGeneralClassificationResults[] {
    return initialGeneralClassification.map((initialGc) => {
      const disqualification = null;
      const completedStages = initialGc.stages.length;

      // Сумма очков на всех этапах.
      const totalFinishPoints = initialGc.stages.reduce(
        (acc, cur) => ({
          category: acc.category + (cur.points?.category || 0),
          absolute: acc.absolute + (cur.points?.absolute || 0),
          absoluteGender: acc.absoluteGender + (cur.points?.absoluteGender || 0),
        }),
        {
          category: 0,
          absolute: 0,
          absoluteGender: 0,
        } as TPoints
      );

      // Суммарное время на всех этапах.
      const totalTimeInMilliseconds = initialGc.stages.reduce(
        (acc, cur) => acc + (cur.durationInMilliseconds || 0),
        0
      );

      return {
        ...initialGc,
        disqualification,
        completedStages,
        totalFinishPoints,
        totalTimeInMilliseconds,
      };
    });
  }

  /**
   * Формирования массива результатов генеральной классификации для райдеров, без подсчета итоговых данных.
   */
  private initGeneralClassificationResults({
    riderIds,
    stagesResults,
    stages,
  }: TInitGeneralClassificationResultsParams): TInitGeneralClassificationResults[] {
    return [...riderIds].map((rider) => {
      const riderGc = {} as TInitGeneralClassificationResults;

      riderGc.stages = [];
      let hasDataFromFirstFinishedStage = false;

      for (const stage of stages) {
        // Результаты райдера на этапах.
        const stageResult = stagesResults.find((result) => {
          return result.rider?.equals(rider) && result.championship.equals(stage._id);
        });

        // Если нет результата на данном этапе stage._id, то переход к следующему этапу.
        if (!stageResult) {
          continue;
        }

        // Данные для генеральной классификации райдера берутся только из первого этапа на котором райдер финишировал. Stages были отсортированы по номеру этапа по возрастанию в методе получения этапов.
        if (!hasDataFromFirstFinishedStage) {
          riderGc.championship = stage.parentChampionship;
          riderGc.rider = rider;
          riderGc.profile = stageResult.profile;
          riderGc.categoryAge = stageResult.categoryAge;
          riderGc.categorySkillLevel = stageResult.categorySkillLevel;
          riderGc.positions = { category: 0, absolute: 0, absoluteGender: 0 };

          hasDataFromFirstFinishedStage = true;
        }

        // Данные по этапам пушатся в массив gc.stages.
        riderGc.stages.push({
          championship: stage._id,
          order: stage.stageOrder,
          urlSlug: stage.urlSlug,
          name: stage.name,
          durationInMilliseconds: stageResult.raceTimeInMilliseconds,
          points: stageResult.points,
          positions: stageResult.positions,
        });
      }

      return riderGc;
    });
  }

  /**
   * Получение этапов серии (тура).
   * @param championshipId - _id родительского чемпионата для запрашиваемых этапов.
   */
  private async getStages(
    championshipId: string | Types.ObjectId
  ): Promise<TGetStagesFromMongo[]> {
    // Получение всех этапов серии.
    const stagesDB = await ChampionshipModel.find(
      { parentChampionship: championshipId, stageOrder: { $exists: true } },
      {
        name: true,
        parentChampionship: true,
        urlSlug: true,
        stageOrder: true,
        races: true,
        isCountedStageInGC: true,
      }
    )
      .populate({ path: 'races', select: ['name', 'categories'] })
      .lean<TGetStagesFromMongo[]>();

    if (stagesDB.length === 0) {
      throw new Error(`Не найден ни один этап для чемпионата с _id: ${championshipId}`);
    }

    // Сортировка по возрастанию Этапов.
    stagesDB.sort((a, b) => a.stageOrder - b.stageOrder);

    return stagesDB;
  }

  /**
   * Получение результатов на каждом из этапов серии (тура).
   * @param stages
   */
  private async getStageResults(
    stageIds: Types.ObjectId[]
  ): Promise<TGCStagesResultsFromMongo[]> {
    const resultsDB = await ResultRaceModel.find(
      { championship: { $in: stageIds } },
      {
        championship: true,
        race: true,
        rider: true,
        profile: true,
        points: true,
        positions: true,
        raceTimeInMilliseconds: true,
        disqualification: true,
        categoryAge: true,
        categorySkillLevel: true,
      }
    ).lean<TGCStagesResultsFromMongo[]>();

    return resultsDB;
  }

  private async getChampionship({
    championshipId,
    urlSlug,
  }: {
    championshipId?: string;
    urlSlug?: string;
  }): Promise<{
    _id: Types.ObjectId;
    type: TChampionshipTypes;
    racePointsTable: Types.ObjectId | null;
  }> {
    if (!championshipId && !urlSlug) {
      throw new Error('Не передан championshipId или urlSlug для запроса данных чемпионата!');
    }

    const query = {
      ...(urlSlug && { urlSlug }),
      ...(championshipId && { _id: championshipId }),
    };

    const champDB = await ChampionshipModel.findOne(query, {
      type: true,
      racePointsTable: true,
    }).lean<{
      _id: Types.ObjectId;
      type: TChampionshipTypes;
      racePointsTable: Types.ObjectId | null;
    }>();

    if (!champDB) {
      throw new Error(`Не найден чемпионат по параметрам: ${JSON.stringify(query)}`);
    }

    return champDB;
  }
}
