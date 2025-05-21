import type { TOptions, TRaceForForm } from '@/types/index.interface';

/**
 * Создание массива option для Select выбора Заезда.
 */
export const createOptionsRaces = (races: TRaceForForm[]): TOptions[] => {
  const options = races.map((race) => ({
    id: race.number,
    translation: race.name,
    name: race._id,
  }));

  return options;
};
/**
 * Создание массива option для Select выбора стартового номера.
 */
export const createOptionsStartNumbers = (startNumbers: number[]): TOptions[] => {
  return startNumbers.map((number) => ({
    id: number,
    translation: number.toString(),
    name: number.toString(),
  }));
};
