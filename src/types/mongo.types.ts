import { ObjectId } from 'mongoose';
import {
  IUserModel,
  TCategories,
  TChampionship,
  TChampionshipStatus,
  TChampionshipTypes,
  TGeneralClassification,
  TModeratorActionLog,
  TNewsBlockInfo,
  TPerson,
  TRace,
  TRaceRegistrationStatus,
  TResultRace,
} from './models.interface';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

/**
 * Данные чемпионата из MongoDB в формате .lean().
 */
export type TGetToursAndSeriesFromMongo = {
  _id: ObjectId;
  name: string;
  quantityStages: number | null;
  startDate: Date;
  endDate: Date;
};

/**
 * Получение категорий для заезда raceNumber чемпионата championshipId из MongoDB в формате .lean().
 */
export type TGetRaceCategoriesFromMongo = Pick<TCategories, 'age' | 'skillLevel'>;

/**
 * Удаление Чемпионата.
 */
export type TDeleteChampionshipFromMongo = {
  status: TChampionshipStatus;
  name: string;
  posterUrl: string;
  races: TRace[];
  _id: Types.ObjectId;
  type: TChampionshipTypes;
  categoriesConfigs: Types.ObjectId[];
} & Document;

export type TRegistrationStatusMongo = {
  raceNumber: number;
  status: TRaceRegistrationStatus;
  race: { name: string; _id: Types.ObjectId };
};

/**
 * Данные этапов серии (тура) parentChampionship.
 */
export type TGetStagesFromMongo = Pick<
  TChampionship,
  '_id' | 'name' | 'urlSlug' | 'isCountedStageInGC'
> & {
  parentChampionship: Types.ObjectId;
  stageOrder: number;
  races: {
    _id: Types.ObjectId;
    name: string;
    categories: Types.ObjectId;
  };
};

/**
 * Результаты этапов для генеральной классификации из БД.
 */
export type TGCStagesResultsFromMongo = Pick<
  TResultRace,
  | '_id'
  | 'championship' // _id этапа
  | 'raceTimeInMilliseconds'
  | 'race'
  | 'rider'
  | 'profile'
  | 'positions'
  | 'points'
  | 'disqualification'
  | 'categoryAge'
  | 'categorySkillLevel'
>;

export type TGetOneGeneralClassificationFromMongo = Omit<TGeneralClassification, 'rider'> & {
  rider: {
    id: number;
    image?: string;
    provider?: { image?: string };
    imageFromProvider: boolean;
  };
};

export type TGetModeratorActionLogServiceFromMongo = Omit<TModeratorActionLog, 'moderator'> & {
  moderator: {
    _id: Types.ObjectId;
    person: TPerson;
  };
};

export type TDeleteNewsServiceFromMongo = {
  _id: ObjectId;
  createdAt: Date;
  poster: string;
  filePdf?: string;
  title: string;
  blocks: TNewsBlockInfo[];
} & Document;

/**
 * Данные из монго для метода getById класса ModeratorActionLogService.
 */
export type TGetByIdModeratorActionLogFromMongo = Omit<TModeratorActionLog, 'moderator'> & {
  moderator: {
    _id: IUserModel['_id'];
    person: IUserModel['person'];
  };
};

/**
 * Данные из монго для метода getAllModeratorActions класса LogService.
 */
export type TGetAllModeratorActionLogsFromMongo = Omit<TModeratorActionLog, 'moderator'> & {
  moderator: {
    _id: IUserModel['_id'];
    image: IUserModel['image'];
    imageFromProvider: IUserModel['imageFromProvider'];
    person: Pick<IUserModel['person'], 'lastName' | 'firstName'>;
    provider: {
      image?: string;
    };
    role: { name: string };
  };
};

/**
 * Получение всех заездов по дистанции distanceId.
 */
export type TRaceMetaFromMongo = {
  _id: Types.ObjectId;
  championship: Types.ObjectId;
  laps: number;
};
