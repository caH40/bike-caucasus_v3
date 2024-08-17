import { getFullDaysFromToday } from './calendar';
import { declineDays } from './decline';
import { TStageDateDescription } from '@/types/index.interface';

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
  console.log(stage);

  const fullDaysFromToday = getFullDaysFromToday(stage.startDate);

  if (fullDaysFromToday === 0) {
    return 'Проводится сегодня ';
  }

  const remainingDaysString = declineDays(fullDaysFromToday);
  return `${stage.stage} этап через: ${remainingDaysString}`;
}

/**
 * Указывает общее количество  и количество завершенных этапов.
 */
export function getStagesCompleted({ stages }: Stages): string {
  const total = stages.length || 1;
  const completed = stages.filter((stage) => stage.status === 'completed').length;

  return `${completed}/${total}`;
}
