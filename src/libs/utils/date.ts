// обработка дат

import { TTimeDetails } from '@/types/index.interface';

/**
 * обработка даты для работы с form
 */
export const handlerDateForm = {
  getIsoDate(date: string | undefined | Date) {
    if (!date) {
      return;
    }
    return new Date(date).toISOString();
  },

  /**
   * Получение даты в формате "год-месяц-день" для работы в форме
   * @param date дата  формате "2024-05-28T12:34:56.789Z"
   * @returns дата в виде "2024-05-28"
   */
  getFormDate(date: string | undefined | Date) {
    if (!date) {
      return;
    }

    const dateObject = new Date(date);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
};

/**
 * Преобразует строковое представление времени в миллисекунды.
 * Строки могут быть числами или пустыми строками.
 * Пустые строки и некорректные значения интерпретируются как 0.
 *
 * @param {TTimeDetails} timeDetails - Объект, содержащий детали времени.
 * @returns {number} Общее количество миллисекунд, представленное в объекте `timeDetails`.
 */
export function timeDetailsToMilliseconds(timeDetails: TTimeDetails): number {
  // Функция для преобразования строки в число, если строка пустая, возвращаем 0.
  const parseTime = (value: string): number => {
    const numberValue = parseInt(value, 10);
    return isNaN(numberValue) ? 0 : numberValue;
  };

  // Преобразование строковых значений в числа.
  const hours = parseTime(timeDetails.hours);
  const minutes = parseTime(timeDetails.minutes);
  const seconds = parseTime(timeDetails.seconds);
  const milliseconds = parseTime(timeDetails.milliseconds);

  // Перевод времени в миллисекунды.
  return (
    hours * 3600 * 1000 + // Часы в миллисекунды.
    minutes * 60 * 1000 + // Минуты в миллисекунды.
    seconds * 1000 + // Секунды в миллисекунды.
    milliseconds // Миллисекунды.
  );
}
