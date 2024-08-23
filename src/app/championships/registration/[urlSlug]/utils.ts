import type { TOptions } from '@/types/index.interface';
import type { TRace } from '@/types/models.interface';

/**
 * Создание массива option для Select выбора Заезда.
 */
export const createOptionsRaces = (races: TRace[]): TOptions[] => {
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
