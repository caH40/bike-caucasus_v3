import { TChampionshipStatus } from '@/types/models.interface';
import { getFullDaysFromToday } from './calendar';
import { declineDays } from './decline';

type Stages = {
  stages: {
    number: number;
    status: TChampionshipStatus;
    startDate: Date;
    startEnd: Date;
  }[];
};

/**
 * Получение подробного состояния Чемпионата.
 * Не начался, какой этап сегодня проходит, в ожидании следующего этапа, завершен, отменен.
 */
export function getStagesCurrent({ stages }: Stages): string {
  const currentStage = stages.find((stage) => stage.status === 'upcoming');

  if (!currentStage) {
    return 'Чемпионат завершен';
  }

  const fullDaysFromToday = getFullDaysFromToday(currentStage.startDate);

  if (fullDaysFromToday === 0) {
    return 'Проводится сегодня ';
  }

  const remainingDaysString = declineDays(fullDaysFromToday);
  return `${currentStage.number} этап через: ${remainingDaysString}`;
}

/**
 * Указывает количество завершенных этапов.
 */
export function getStagesCompleted({ stages }: Stages): string {
  const total = stages.length || 1;
  const completed = stages.filter((stage) => stage.status === 'completed').length;

  return `${completed}/${total}`;
}
