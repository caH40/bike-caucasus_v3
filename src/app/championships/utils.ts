import { championshipTypesMap } from '@/constants/championship';
import { bikeTypesMap } from '@/constants/trail';
import { TDtoChampionship } from '@/types/dto.types';
import type { TParentChampionshipForClient } from '@/types/index.interface';
import type { TChampionshipTypes } from '@/types/models.interface';
/**
 * Формирование заголовка для страницы Регистрации.
 */
export function getTitleForREgistration({
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
 * Формирование заголовка для страницы Чемпионат описание.
 */
export function getTitleChampionship({
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
      return name;
    }

    default: {
      // Если не поступили данные о Родительском чемпионате.
      if (!parentChampionship) {
        return name;
      }

      return `${stage} Этап: "${name}". ${
        championshipTypesMap.get(parentChampionship.type)?.translation
      } "${parentChampionship.name}"`;
    }
  }
}

/**
 * Формирование заголовка для страницы Чемпионат описание.
 */
export function getH1Championship({ champ }: { champ: TDtoChampionship }) {
  const messageNotForStage = `Чемпионат по велоспорту ${champ.name}, в дисциплине велосипед ${
    bikeTypesMap.get(champ.type)?.translation
  }`;
  switch (champ.type) {
    case 'single': {
      return messageNotForStage;
    }

    default: {
      // Если не поступили данные о Родительском чемпионате.
      if (!champ.parentChampionship) {
        return messageNotForStage;
      }

      return `Любительская велогонка ${champ.stage} Этапа: "${champ.name}". ${
        championshipTypesMap.get(champ.parentChampionship.type)?.translation
      } "${champ.parentChampionship.name}"`;
    }
  }
}

/**
 * Формирование заголовка для страницы Чемпионат описание.
 */
export function getDescriptionChampionship({ champ }: { champ: TDtoChampionship }) {
  const messageNotForStage = `Примите участие в Чемпионате по велоспорту ${
    champ.name
  } на велосипеде тип - ${
    bikeTypesMap.get(champ.bikeType)?.translation
  }. Испытайте адреналин и наслаждение от велогонки!`;
  switch (champ.type) {
    case 'single': {
      return messageNotForStage;
    }

    default: {
      // Если не поступили данные о Родительском чемпионате.
      if (!champ.parentChampionship) {
        return messageNotForStage;
      }

      return `Примите участие в Чемпионате по велоспорту на ${champ.stage} Этапа: "${
        champ.name
      }". ${championshipTypesMap.get(champ.parentChampionship.type)?.translation} "${
        champ.parentChampionship.name
      }". Велогонка на велосипеде тип: ${
        bikeTypesMap.get(champ.bikeType)?.translation
      }. Испытайте адреналин и наслаждение от велогонки!`;
    }
  }
}
