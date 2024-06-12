import { DateTime } from 'luxon';

export function getMonthDaysWithOverflow(year: number, month: number): DateTime[] {
  // Начало месяца.
  const startOfMonth = DateTime.local(year, month, 1).setLocale('ru');

  // Конец месяца.
  const endOfMonth = startOfMonth.endOf('month');

  // Найти день недели начала и конца месяца.
  const startWeekday = startOfMonth.weekday; // 1 = понедельник, 7 = воскресенье
  const endWeekday = endOfMonth.weekday;

  // Создать массив дней месяца.
  const days: DateTime[] = [];
  for (let i = 1; i <= endOfMonth.day; i++) {
    days.push(DateTime.local(year, month, i));
  }

  // Добавить дни предыдущего месяца до первого понедельника.
  if (startWeekday !== 1) {
    let i = 1;
    while (startWeekday - i !== 0) {
      days.unshift(startOfMonth.minus({ days: i }));
      i++;
    }
  }

  // Добавить дни следующего месяца до воскресенья.
  if (endWeekday !== 7) {
    const nextMonthStart = endOfMonth.plus({ days: 1 });
    for (let i = 0; i < 7 - endWeekday; i++) {
      days.push(nextMonthStart.plus({ days: i }));
    }
  }

  return days;
}

/**
 * Получение названия месяца на русском языке.
 */
export function getMonthNameInRussian(year: number, month: number): string {
  const dt = DateTime.local(year, month, 1).setLocale('ru');
  return dt.toLocaleString({ month: 'long' });
}

/**
 * Получение месяца, года и месяца в строчном формате
 * предыдущего или следующего месяца относительно входных данных.
 */
export function getPrevOrNextMonth(
  year: number,
  month: number,
  needNext?: boolean
): { year: number; monthStr: string; month: number } {
  const dt = DateTime.local(year, month, 1).setLocale('ru');

  const monthCurrent = needNext ? dt.plus({ month: 1 }) : dt.minus({ month: 1 });

  return {
    monthStr: monthCurrent.toLocaleString({ month: 'long' }),
    year: monthCurrent.year,
    month: monthCurrent.month,
  };
}

// Тип для представления текущих даты и времени.
type CurrentDateTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  milliseconds: number;
};

/**
 * Возвращает текущий год, месяц, число, часы, минуты, секунды и дату в форме миллисекунд.
 */
export function getCurrentDateTime(): CurrentDateTime {
  const now = DateTime.local();

  return {
    year: now.year,
    month: now.month,
    day: now.day,
    hour: now.hour,
    minute: now.minute,
    second: now.second,
    milliseconds: now.toMillis(),
  };
}
