import { ObjectId } from 'mongoose';
import {
  TCategories,
  TChampionshipStatus,
  TChampionshipTypes,
  TRace,
  TRaceRegistrationStatus,
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
