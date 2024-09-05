import { TOptions } from '@/types/index.interface';

/**
 * Количество записей при пагинации.
 */
export const records = [
  { id: 0, value: 5 },
  { id: 1, value: 10 },
  { id: 2, value: 15 },
  { id: 3, value: 20 },
  { id: 4, value: 25 },
  { id: 5, value: 50 },
];

/**
 * Опции для select выбора пола.
 */
export const genderOptions: TOptions[] = [
  { id: 0, translation: 'мужской', name: 'male' },
  { id: 1, translation: 'женский', name: 'female' },
];
