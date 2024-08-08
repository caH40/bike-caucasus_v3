import { TOptions } from '@/types/index.interface';

/**
 * Тип Чемпионата.
 */
export const championshipTypes: TOptions[] = [
  { id: 0, translation: 'Одиночный', name: 'single' },
  { id: 1, translation: 'Серия', name: 'series' },
  { id: 2, translation: 'Тур', name: 'tour' },
];

/**
 * Статус Чемпионата.
 */
export const championshipStatus: TOptions[] = [
  { id: 0, translation: 'Не начался', name: 'upcoming' },
  { id: 1, translation: 'Происходящий', name: 'ongoing' },
  { id: 2, translation: 'Завершенный', name: 'completed' },
  { id: 3, translation: 'Отмененный', name: 'cancelled' },
];
