/**
 * Формирование строки отставания от лидера и от предыдущего райдера для отображения в финишном протоколе Заезда.
 */
export class GapTimeFormatter {
  // Метод для конвертации секунд в отформатированное время
  static secondesToTime(rowSeconds: number): string | null {
    if (rowSeconds === null) {
      return null; // Если null, это лидер
    }

    // Если меньше секунды, возвращаем миллисекунды.
    if (rowSeconds < 1000) {
      return String(rowSeconds);
    }

    const seconds = rowSeconds / 1000;

    // Если отставание больше часа.
    if (seconds >= 3600) {
      const hour = Math.trunc(seconds / 3600);
      const minutes = Math.trunc((seconds - hour * 3600) / 60);
      const second = Math.trunc(seconds - hour * 3600 - minutes * 60);
      return `${this.addNull(hour)}:${this.addNull(minutes)}:${this.addNull(second)}`;
    }

    // Если отставание меньше часа.
    if (seconds < 3600) {
      const minutes = Math.trunc(seconds / 60);
      const second = Math.trunc(seconds - minutes * 60);
      return `${this.addNull(minutes)}:${this.addNull(second)}`;
    }

    return null;
  }

  // Метод для добавления ведущего нуля в строке с числом
  static addNull(rowNumber: number): string {
    const number = String(rowNumber);
    if (number.length === 1) {
      return '0' + number;
    }
    return number;
  }

  // Метод для форматирования гэпа в строку
  static gapWithStr(gap: string | null): string | null {
    if (gap === null) {
      return null;
    }

    // Если отставание меньше секунды. Отображаются миллисекунды.
    if (gap.toString().length < 4) {
      return `+${gap}мс`;
    }

    return `+${gap}`;
  }

  // Метод для получения форматированного времени гэпа в протоколе
  static getGapsInProtocol(gap: number): string | null {
    const gapTime = this.secondesToTime(gap);
    return this.gapWithStr(gapTime);
  }
}
