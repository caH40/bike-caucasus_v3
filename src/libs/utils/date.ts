// обработка дат

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
