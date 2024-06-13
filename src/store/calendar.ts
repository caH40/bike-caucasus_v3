import {
  getDateTime,
  getMonthDaysWithOverflow,
  getMonthNameInRussian,
  getPrevOrNextMonth,
} from '@/libs/utils/calendar';
import { create } from 'zustand';

// Определяем интерфейс для хранилища календаря
interface TCalendarStore {
  month: number;
  year: number;
  calendar: DateDay[];
  dateStr: string;

  // eslint-disable-next-line no-unused-vars
  getMonth: ({ target }: { target: 'next' | 'prev' }) => void;
  getCurrentMonth: () => void;
}

// Месяц и год для инициализации данных.
const { year, month } = getDateTime();

// Тип описания дня.
type DateDay = {
  id: number;
  day: number;
  month: number;
  year: number;
  isoDate: string; // Дата ISO 8601 в формате.
};

/**
 * Устанавливает массив дат для входных данных  month, year
 */
function getCalendar(year: number, month: number): DateDay[] {
  const days = getMonthDaysWithOverflow(year, month);
  return days.map((day, index) => ({
    id: index,
    day: day.day,
    month: day.month,
    year: day.year,
    isoDate: `${day.year}-${day.month.toString().padStart(2, '0')}-${day.day
      .toString()
      .padStart(2, '0')}`,
  }));
}

/**
 * Создает хранилище состояния для отслеживания загрузки.
 */
export const useCalendarStore = create<TCalendarStore>((set) => ({
  month,
  year,
  dateStr: `${getMonthNameInRussian(year, month)} ${year}`,
  calendar: getCalendar(year, month),

  /**
   * Получение данных календаря следующего или предыдущего месяца.
   */
  getMonth: ({ target }: { target: 'next' | 'prev' }) => {
    return set((state) => {
      const needNext = target === 'next' ? true : false;
      const monthPrev = getPrevOrNextMonth(state.year, state.month, needNext);

      return {
        dateStr: `${monthPrev.monthStr} ${monthPrev.year}`,
        calendar: getCalendar(monthPrev.year, monthPrev.month),
        year: monthPrev.year,
        month: monthPrev.month,
      };
    });
  },

  /**
   * Получение данных календаря текущего месяца.
   */
  getCurrentMonth: () => {
    const { year, month } = getDateTime();
    set({
      dateStr: `${getMonthNameInRussian(year, month)} ${year}`,
      calendar: getCalendar(year, month),
      year: year,
      month: month,
    });
  },
}));
