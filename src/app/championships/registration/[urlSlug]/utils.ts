import type { TOptions, TRaceClient } from '@/types/index.interface';

/**
 * Создание массива option для Select выбора Заезда.
 */
export const createOptionsRaces = (races: TRaceClient[]): TOptions[] => {
  const options = races.map((race) => ({
    id: race.number,
    translation: race.name,
    name: race.number.toString(),
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
