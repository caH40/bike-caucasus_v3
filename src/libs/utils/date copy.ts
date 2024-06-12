import { Timer } from './timer';

type Month =
  | 'январь'
  | 'февраль'
  | 'март'
  | 'апрель'
  | 'май'
  | 'июнь'
  | 'июль'
  | 'август'
  | 'сентябрь'
  | 'октябрь'
  | 'ноябрь'
  | 'декабрь';

const months: Month[] = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

/**
 * Возвращает название месяца на русском языке.
 */
export const getMonths = (date: Date): Month | 'ошибка' => {
  if (!(date instanceof Date)) {
    return 'ошибка';
  }
  return months[date.getMonth()];
};

/**
 * Возвращает день.
 */
export const getDay = (date: Date): number => {
  if (!(date instanceof Date)) {
    return 0;
  }
  return new Date(date).getDate();
};

/**
 * Функция для вычисления оставшегося времени.
 */
export const getTimeLeft = (endTime: number) => {
  const timerService = new Timer();
  const currentTime = (endTime - Date.now()) / 1000; // Оставшееся время в секундах
  return {
    days: timerService.getDays(currentTime),
    hours: timerService.getHours(currentTime),
    minutes: timerService.getMinutes(currentTime),
  };
};
