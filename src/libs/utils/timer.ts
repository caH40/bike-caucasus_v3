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
