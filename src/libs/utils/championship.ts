import { TChampionshipStatus } from '@/types/models.interface';
import { declineDays } from './decline';
import { TStageDateDescription } from '@/types/index.interface';
import { getFullDaysFromDates } from './calendar';

type Stage = {
  stage: TStageDateDescription;
};
type Stages = {
  stages: TStageDateDescription[];
};

/**
 * Получение подробного состояния Чемпионата.
 * Не начался, какой этап сегодня проходит, в ожидании следующего этапа, завершен, отменен.
 */
export function getStagesCurrent({ stage }: Stage): string {
  // const fullDaysFromToday = getFullDaysFromToday(stage.startDate);

  // if (fullDaysFromToday === 0) {
  //   return 'Проводится сегодня ';
  // }

  // const remainingDaysString = declineDays(fullDaysFromToday);
  // return `${stage.stage} этап через: ${remainingDaysString}`;
  return 'test';
}

/**
 * Указывает общее количество  и количество завершенных этапов.
 */
export function getStagesCompleted({ stages }: Stages): string {
  const total = stages.length || 1;
  const completed = stages.filter((stage) => stage.status === 'completed').length;

  return `${completed}/${total}`;
}

/**
 * Определяет текущий статус чемпионата на основе его дат начала и окончания, а также текущего статуса.
 *
 * @param {Object} params - Объект с параметрами функции.
 * @param {TChampionshipStatus} params.status - Текущий статус чемпионата.
 * @param {Date} params.startDate - Дата начала чемпионата.
 * @param {Date} params.endDate - Дата окончания чемпионата.
 * @returns {TChampionshipStatus} - Возвращает текущий статус чемпионата ('upcoming', 'ongoing', 'completed' или возвращает текущий статус, если он уже завершен или отменен).
 */
export function getCurrentStatus({
  status,
  startDate,
  endDate,
}: {
  status: TChampionshipStatus;
  startDate: Date;
  endDate: Date;
}): TChampionshipStatus {
  // Если чемпионат уже завершен или отменен, возвращаем текущий статус без изменений
  if (status === 'completed' || status === 'cancelled') {
    return status;
  }

  const today = new Date();

  // Вычисляем количество полных дней от текущей даты до даты начала чемпионата
  const fullDaysFromStartAndToday = getFullDaysFromDates({
    startDate: today,
    endDate: startDate,
  });

  // Если дата начала чемпионата в будущем, статус - "предстоящий"
  if (fullDaysFromStartAndToday > 0) {
    return 'upcoming';
  }
  // Если чемпионат начинается сегодня, статус - "идущий"
  else if (fullDaysFromStartAndToday === 0) {
    return 'ongoing';
  }

  // Вычисляем количество полных дней от текущей даты до даты окончания чемпионата
  const fullDaysFromEndAndToday = getFullDaysFromDates({
    startDate: today,
    endDate,
  });

  // Если чемпионат еще не завершился, статус - "идущий"
  if (fullDaysFromEndAndToday >= 0) {
    return 'ongoing';
  }
  // В противном случае, чемпионат завершен
  else {
    return 'completed';
  }
}
