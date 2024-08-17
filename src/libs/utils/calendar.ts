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
 * Пример функции для получения названия дня недели на русском языке
 */
export function getDayNameInRussian(timestamp: number): string {
  const date = DateTime.fromMillis(timestamp, { locale: 'ru' });
  const dayName = date.toLocaleString({ weekday: 'long' });
  return capitalizeFirstLetter(dayName);
}
/**
 * Создание заглавной первой буквы дня недели.
 */
function capitalizeFirstLetter(word: string): string {
  if (!word) {
    return word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
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
  isoDate: string;
};

/**
 * Возвращает год, месяц, число, часы, минуты, секунды и дату в форме миллисекунд.
 */
export function getDateTime(date?: Date): CurrentDateTime {
  let dateCurrent = {} as DateTime<true | false>;
  if (date) {
    dateCurrent = DateTime.fromJSDate(date);
  } else {
    dateCurrent = DateTime.local();
  }

  // Проверка на валидность объекта DateTime
  if (!dateCurrent.isValid) {
    throw new Error('Invalid DateTime');
  }

  return {
    year: dateCurrent.year,
    month: dateCurrent.month,
    day: dateCurrent.day,
    hour: dateCurrent.hour,
    minute: dateCurrent.minute,
    second: dateCurrent.second,
    milliseconds: dateCurrent.toMillis(),
    isoDate:
      dateCurrent.toISODate() || `${dateCurrent.year}-${dateCurrent.month}-${dateCurrent.day}`,
  };
}

/**
 * Вычисляет количество полных дней между startDate и endDate.
 * @param startDate - Начальная дата.
 * @param endDate - Конечная дата.
 * @returns Количество полных дней между датами.
 */

export function getFullDaysFromDates({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): number {
  // Получение текущей даты

  const startTargetDate = DateTime.fromJSDate(startDate).startOf('day');
  const endTargetDate = DateTime.fromJSDate(endDate).startOf('day');

  // Вычисление разницы в днях
  const diffInDays = endTargetDate.diff(startTargetDate, 'days').days;

  // Возвращение количества полных дней
  return Math.floor(diffInDays);
}
