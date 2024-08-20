import { championshipTypesMap } from '@/constants/championship';
import type { TOptions, TParentChampionshipForClient } from '@/types/index.interface';
import type { TChampionshipTypes, TRace } from '@/types/models.interface';

/**
 * Формирование заголовка для страницы Регистрации.
 */
export function getTitle({
  name,
  parentChampionship,
  type,
  stage,
}: {
  name: string;
  parentChampionship?: TParentChampionshipForClient;
  type: TChampionshipTypes;
  stage: number | null;
}) {
  switch (type) {
    case 'single': {
      return `Регистрация на Чемпионат: ${name}`;
    }

    default: {
      // Если не поступили данные о Родительском чемпионате.
      if (!parentChampionship) {
        return `Регистрация на ${stage} Этап: "${name}"`;
      }

      return `Регистрация на ${stage} Этап: "${name}". ${
        championshipTypesMap.get(parentChampionship.type)?.translation
      } "${parentChampionship.name}"`;
    }
  }
}

/**
 * Создание массива option для Select.
 */
export const createOptionsRaces = (races: TRace[]): TOptions[] => {
  const options = races.map((race) => ({
    id: race.number,
    translation: race.name,
    name: race.number.toString(),
  }));

  return options;
};
