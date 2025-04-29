import { ObjectId } from 'mongoose';
import { TCategories } from './models.interface';

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
