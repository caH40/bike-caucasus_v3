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

  const startTargetDate = DateTime.fromJSDate(startDate).startOf('day').setLocale('ru');
  const endTargetDate = DateTime.fromJSDate(endDate).startOf('day').setLocale('ru');

  // Вычисление разницы в днях
  const diffInDays = endTargetDate.diff(startTargetDate, 'days').days;

  // Возвращение количества полных дней
  return Math.floor(diffInDays);
}

/**
 * Форматирует интервал дат в зависимости от их значений.
 * @param startDate - Дата начала в формате JavaScript Date.
 * @param endDate - Дата окончания в формате JavaScript Date.
 * @returns Строка, представляющая интервал дат.
 */
export function formatDateInterval({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): string {
  const start = DateTime.fromJSDate(startDate).setLocale('ru');
  const end = DateTime.fromJSDate(endDate).setLocale('ru');

  // Проверка, совпадают ли startDate и endDate с точностью до дня
  if (start.hasSame(end, 'day')) {
    return start.toFormat('dd MMMM'); // Полный формат для одной даты
  }
  // Проверка, совпадают ли месяцы и годы
  else if (start.hasSame(end, 'month')) {
    return `${start.toFormat('dd')}-${end.toFormat('dd')} ${start.toFormat('MMMM yyyy')}`; // Формат дд-дд ммм
  }
  // Разные месяцы и годы
  else {
    return `${start.toFormat('dd MMMM')} - ${end.toFormat('dd MMMM')}`;
  }
}

/**
 * Возвращает количество полных лет и количество неполных лет со дня рождения.
 *
 * @param {Date} birthDate - Дата рождения пользователя в формате объекта Date.
 * @returns {{ fullYears: number, fractionalYears: number }} Объект с количеством полных лет и количеством неполных лет.
 * - `fullYears`: Количество полных лет.
 * - `fractionalYears`: Разница между текущим годом и годом рождения.
 */
export function getAgeDetails(birthDate: Date): { fullYears: number; fractionalYears: number } {
  // Преобразуем объект Date в объект DateTime Luxon
  const birth = DateTime.fromJSDate(birthDate);
  // Получаем текущее время
  const now = DateTime.now();

  // Вычисляем количество полных лет
  const fullYears = now.diff(birth, 'years').years;

  // Вычисляем количество неполных лет как разницу между текущим годом и годом рождения
  const fractionalYears = now.year - birth.year;

  return {
    fullYears: Math.floor(fullYears), // Полные годы
    fractionalYears, // Неполные годы (текущий год минус год рождения)
  };
}
