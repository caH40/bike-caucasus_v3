import { ObjectId } from 'mongoose';

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
