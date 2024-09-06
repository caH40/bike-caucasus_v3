/**
 * Класс для получения полных дней, часов, минут и секунд из временного интервала в секундах.
 */
export class Timer {
  private static readonly SECONDS_IN_HOUR = 60 * 60;
  private static readonly SECONDS_IN_DAY = 24 * Timer.SECONDS_IN_HOUR;

  /**
   * Получение количества полных дней из периода в секундах.
   * @param periodInSeconds Период в секундах.
   * @returns Количество полных дней.
   */
  public getDays(periodInSeconds: number): number {
    return Math.trunc(periodInSeconds / Timer.SECONDS_IN_DAY);
  }

  /**
   * Получение количества полных часов (0-23) из периода в секундах.
   * @param periodInSeconds Период в секундах.
   * @returns Количество полных часов.
   */
  public getHours(periodInSeconds: number): number {
    return Math.trunc(this.periodWithoutDays(periodInSeconds) / Timer.SECONDS_IN_HOUR);
  }

  /**
   * Получение количества полных минут (0-59) из периода в секундах.
   * @param periodInSeconds Период в секундах.
   * @returns Количество полных минут.
   */
  public getMinutes(periodInSeconds: number): number {
    return Math.trunc(
      (this.periodWithoutDays(periodInSeconds) -
        this.getHours(periodInSeconds) * Timer.SECONDS_IN_HOUR) /
        60
    );
  }

  /**
   * Получение оставшихся секунд (0-59) из периода в секундах.
   * @param periodInSeconds Период в секундах.
   * @returns Количество оставшихся секунд.
   */
  public getSeconds(periodInSeconds: number): number {
    return (
      this.periodWithoutDays(periodInSeconds) -
      this.getHours(periodInSeconds) * Timer.SECONDS_IN_HOUR -
      this.getMinutes(periodInSeconds) * 60
    );
  }

  /**
   * Период в секундах, величиной меньше чем 24 часа.
   * @param periodInSeconds Период в секундах.
   * @returns Период без учета полных дней.
   */
  private periodWithoutDays(periodInSeconds: number): number {
    return periodInSeconds % Timer.SECONDS_IN_DAY;
  }
}

/**
 * Форматирует время в миллисекундах в строку формата чч:мм:сс.миллисекунды.
 * Если миллисекунды равны 000, то они не отображаются.
 * Если часы равны 0, то отображается только мм:сс.миллисекунды.
 * Если часы и минуты равны 0, отображается только сс.миллисекунды.
 *
 * @param {number} milliseconds - Время в миллисекундах, которое нужно преобразовать.
 * @returns {string} - Строка времени в формате чч:мм:сс.миллисекунды.
 */
export function formatTimeToStr(milliseconds: number): string {
  // Извлечение миллисекунд из общего времени.
  const ms = milliseconds % 1000;

  // Общие секунды и оставшиеся секунды после деления на 60.
  const totalSeconds = Math.floor(milliseconds / 1000);
  const seconds = totalSeconds % 60;

  // Общие минуты и оставшиеся минуты после деления на 60.
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;

  // Часы (всё, что больше минут).
  const hours = Math.floor(totalMinutes / 60);

  // Функция для добавления ведущих нулей (например, превращает 4 в 04).
  const pad = (num: number) => String(num).padStart(2, '0');

  // Формирование строки времени
  let timeString = hours > 0 ? `${pad(hours)}:` : ''; // Добавляем часы, если они больше 0
  timeString += `${pad(minutes)}:${pad(seconds)}`; // Добавляем минуты и секунды

  // Добавляем миллисекунды, если они больше 0
  if (ms > 0) {
    timeString += `.${String(ms).padStart(3, '0')}`;
  }

  return timeString;
}
