import { championshipTypesMap } from '@/constants/championship';
import { bikeTypesMap } from '@/constants/trail';
import { getDateTime } from '@/libs/utils/calendar';
import { getTimerLocal } from '@/libs/utils/date-local';
import { TDtoChampionship } from '@/types/dto.types';
import type { TParentChampionshipForClient } from '@/types/index.interface';
import type { TChampionshipTypes } from '@/types/models.interface';

type PageName =
  | 'Регистрация на'
  | 'Результаты'
  | 'Зарегистрированные участники на'
  | 'Документы по'
  | 'Редактирование';

/**
 * Формирование названия страницы результатов Чемпионата.
 */
export function getChampionshipPagesTitleName({
  name,
  parentChampionship,
  type,
  stageOrder,
  pageName,
}: {
  name: string;
  parentChampionship?: TParentChampionshipForClient;
  type: TChampionshipTypes;
  stageOrder: number | null;
  pageName: PageName;
}): string {
  const typeName: Record<'series' | 'tour', string> = {
    series: 'серии заездов ',
    tour: 'тура ',
  };

  const parentType = parentChampionship?.type;
  const parentName = parentChampionship?.name;

  let parentTypeText = '';
  if (parentType === 'series' || parentType === 'tour') {
    parentTypeText = typeName[parentType];
  }

  const words: Record<PageName, { stage: string; champ: string }> = {
    Результаты: { stage: 'Этапа', champ: 'Соревнования' },
    'Регистрация на': { stage: 'Этап', champ: 'Соревнование' },
    'Зарегистрированные участники на': { stage: 'Этап', champ: 'Соревнование' },
    'Документы по': { stage: 'Этапу', champ: 'Соревнованию' },
    Редактирование: { stage: 'Этапа', champ: 'Соревнования' },
  };

  const prefix: Record<TChampionshipTypes, string> = {
    series: `Серии заездов «${name}»`,
    tour: `Тура «${name}»`,
    stage: `${words[pageName].stage} №${stageOrder} «${name}» ${parentTypeText}${
      parentName ? `«${parentName}»` : ''
    }`,
    single: `${words[pageName].champ} «${name}»`,
  };

  return `${pageName} ${prefix[type]}`;
}

/**
 * Формирование Title для страницы Регистрации.
 */
export function getTitleForRegistration({ champ }: { champ: TDtoChampionship }) {
  switch (champ.type) {
    case 'single': {
      return `Открыта регистрация на велогонку: ${champ.name}. Дата старта ${
        getDateTime(new Date(champ.startDate)).dateDDMMYYYY
      }`;
    }

    default: {
      // Если не поступили данные о Родительском чемпионате.
      if (!champ.parentChampionship) {
        return `Открыта регистрация на велогонку на ${champ.stageOrder} Этап: "${
          champ.name
        }". Дата старта ${getDateTime(new Date(champ.startDate)).dateDDMMYYYY}`;
      }

      return `Регистрируйтесь на велогонку на ${champ.stageOrder} Этап: "${champ.name}". ${
        championshipTypesMap.get(champ.parentChampionship.type)?.translation
      } "${champ.parentChampionship.name}". Дата старта ${
        getDateTime(new Date(champ.startDate)).dateDDMMYYYY
      }`;
    }
  }
}

/**
 * Формирование Description для страницы Регистрации.
 */
export function getDescriptionForRegistration({ champ }: { champ: TDtoChampionship }) {
  switch (champ.type) {
    case 'single': {
      return `Регистрируйтесь на велогонку по велоспорту: ${champ.name}. Дата старта ${
        getDateTime(new Date(champ.startDate)).dateDDMMYYYY
      }. Присоединяйтесь к соревнованиям, испытайте себя!`;
    }

    default: {
      // Если не поступили данные о Родительском чемпионате.
      if (!champ.parentChampionship) {
        return `Регистрируйтесь на велогонку по велоспорту на ${champ.stageOrder} Этап: "${
          champ.name
        }". Дата старта ${
          getDateTime(new Date(champ.startDate)).dateDDMMYYYY
        } Присоединяйтесь к соревнованиям, испытайте себя!`;
      }

      return `Регистрируйтесь на велогонку по велоспорту на ${champ.stageOrder} Этап: "${
        champ.name
      }". ${championshipTypesMap.get(champ.parentChampionship.type)?.translation} "${
        champ.parentChampionship.name
      }". Дата старта ${
        getDateTime(new Date(champ.startDate)).dateDDMMYYYY
      } Присоединяйтесь к соревнованиям, испытайте себя!`;
    }
  }
}

// ==============================================================================================
// ==============================================================================================

/**
 * Формирование Title для страницы Зарегистрированные участники.
 */
export function getTitleForRegistered({ champ }: { champ: TDtoChampionship }) {
  switch (champ.type) {
    case 'single': {
      return `Зарегистрированные участники на велогонку: ${champ.name}, которая стартует ${
        getDateTime(new Date(champ.startDate)).dateDDMMYYYY
      }`;
    }

    default: {
      // Если не поступили данные о Родительском чемпионате.
      if (!champ.parentChampionship) {
        return `Зарегистрированные участники на велогонку на ${champ.stageOrder} Этап: "${
          champ.name
        }". Стартует ${getDateTime(new Date(champ.startDate)).dateDDMMYYYY}`;
      }

      return `Зарегистрированные участники на велогонку на ${champ.stageOrder} Этап: "${
        champ.name
      }". ${championshipTypesMap.get(champ.parentChampionship.type)?.translation} "${
        champ.parentChampionship.name
      }". Стартует ${getDateTime(new Date(champ.startDate)).dateDDMMYYYY}`;
    }
  }
}

/**
 * Формирование Description для страницы Зарегистрированные участники.
 */
export function getDescriptionForRegistered({ champ }: { champ: TDtoChampionship }) {
  switch (champ.type) {
    case 'single': {
      return `Зарегистрированные участники на велогонку по велоспорту: ${
        champ.name
      }. Дата старта ${getDateTime(new Date(champ.startDate)).dateDDMMYYYY}. Тип велосипеда: ${
        bikeTypesMap.get(champ.bikeType)?.translation
      }!`;
    }

    default: {
      // Если не поступили данные о Родительском чемпионате.
      if (!champ.parentChampionship) {
        return `Зарегистрированные участники на велогонку по велоспорту на ${
          champ.stageOrder
        } Этап: "${champ.name}". Дата старта ${
          getDateTime(new Date(champ.startDate)).dateDDMMYYYY
        } Тип велосипеда: ${bikeTypesMap.get(champ.bikeType)?.translation}!`;
      }

      return `Зарегистрированные участники на велогонку по велоспорту на ${
        champ.stageOrder
      } Этап: "${champ.name}". ${
        championshipTypesMap.get(champ.parentChampionship.type)?.translation
      } "${champ.parentChampionship.name}". Дата старта ${
        getDateTime(new Date(champ.startDate)).dateDDMMYYYY
      } Тип велосипеда: ${bikeTypesMap.get(champ.bikeType)?.translation}!`;
    }
  }
}

// ==============================================================================================
// ==============================================================================================

/**
 * Формирование h1 для страницы Чемпионат описание.
 */
export function getH1Championship({
  name,
  parentChampionship,
  type,
  stageOrder,
}: {
  name: string;
  parentChampionship?: TParentChampionshipForClient;
  type: TChampionshipTypes;
  stageOrder: number | null;
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

      return `${stageOrder} Этап: "${name}". ${
        championshipTypesMap.get(parentChampionship.type)?.translation
      } "${parentChampionship.name}"`;
    }
  }
}

/**
 * Формирование Title для страницы Чемпионат описание.
 */
export function getTitleChampionship({ champ }: { champ: TDtoChampionship }) {
  const messageNotForStage = `Чемпионат по велоспорту ${champ.name} в дисциплине велосипед ${
    bikeTypesMap.get(champ.bikeType)?.translation
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

      return `Любительская велогонка ${champ.stageOrder} Этапа: "${champ.name}". ${
        championshipTypesMap.get(champ.parentChampionship.type)?.translation
      } "${champ.parentChampionship.name}"`;
    }
  }
}

/**
 * Формирование Description для страницы Чемпионат описание.
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

      return `Примите участие в Чемпионате по велоспорту на ${champ.stageOrder} Этапа: "${
        champ.name
      }". ${championshipTypesMap.get(champ.parentChampionship.type)?.translation} "${
        champ.parentChampionship.name
      }". Велогонка на велосипеде тип: ${
        bikeTypesMap.get(champ.bikeType)?.translation
      }. Испытайте адреналин и наслаждение от велогонки!`;
    }
  }
}

// ==============================================================================================
// ==============================================================================================

/**
 * Формирование Title для страницы Результаты заездов.
 */
export function getTitleResultsRace({ champ }: { champ: TDtoChampionship }) {
  const messageNotForStage = `Результаты соревнования по велоспорту «${
    champ.name
  }» ${getTimerLocal(champ.endDate, 'DDMMYY')}`;
  switch (champ.type) {
    case 'single': {
      return messageNotForStage;
    }

    default: {
      // Если не поступили данные о Родительском чемпионате.
      if (!champ.parentChampionship) {
        return messageNotForStage;
      }

      return `Результаты велогонки ${champ.stageOrder} Этап: "${champ.name}". ${
        championshipTypesMap.get(champ.parentChampionship.type)?.translation
      } "${champ.parentChampionship.name}"`;
    }
  }
}
// export function getTitleResultsRace({ champ }: { champ: TDtoChampionship }) {
//   const messageNotForStage = `Результаты соревнования по велоспорту «${
//     champ.name
//   }» в дисциплине ${
//     bikeTypesMap.get(champ.bikeType)?.translation
//   } велосипед. Дата проведения: ${getTimerLocal(champ.endDate, 'DDMMYY')}`;
//   switch (champ.type) {
//     case 'single': {
//       return messageNotForStage;
//     }

//     default: {
//       // Если не поступили данные о Родительском чемпионате.
//       if (!champ.parentChampionship) {
//         return messageNotForStage;
//       }

//       return `Результаты велогонки ${champ.stageOrder} Этап: "${champ.name}". ${
//         championshipTypesMap.get(champ.parentChampionship.type)?.translation
//       } "${champ.parentChampionship.name}"`;
//     }
//   }
// }

/**
 * Формирование Description для страницы Результаты заездов.
 */
export function getDescriptionResultsRace({ champ }: { champ: TDtoChampionship }) {
  const messageNotForStage = `Финишные протоколы Чемпионата по велоспорту «${
    champ.name
  }» от ${getTimerLocal(champ.endDate, 'DDMMYY')} в дисциплине ${
    bikeTypesMap.get(champ.bikeType)?.translation
  } велосипед. Заезды:${champ.races.reduce((acc, cur) => acc + ' ' + cur.name + ';', '')}`;
  switch (champ.type) {
    case 'single': {
      return messageNotForStage;
    }

    default: {
      // Если не поступили данные о Родительском чемпионате.
      if (!champ.parentChampionship) {
        return messageNotForStage;
      }

      return `Финишные протоколы велогонки ${champ.stageOrder} Этап: "${champ.name}". ${
        championshipTypesMap.get(champ.parentChampionship.type)?.translation
      } "${champ.parentChampionship.name}"`;
    }
  }
}
