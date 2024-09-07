import type { TOptions, TOptionsMap, TRaceForForm } from '@/types/index.interface';

/**
 * Тип Чемпионата.
 */
export const championshipTypes: TOptions[] = [
  { id: 0, translation: 'Соревнование', name: 'single' },
  { id: 1, translation: 'Серия', name: 'series' },
  { id: 2, translation: 'Тур', name: 'tour' },
  { id: 3, translation: 'Этап', name: 'stage' },
];

/**
 * Тип Чемпионата.
 */
export const championshipTypesMap: TOptionsMap = new Map([
  ['single', { translation: 'Соревнование' }],
  ['series', { translation: 'Серия' }],
  ['tour', { translation: 'Тур' }],
  ['stage', { translation: 'Этап' }],
]);

/**
 * Статус Чемпионата.
 */
export const championshipStatus: TOptions[] = [
  { id: 0, translation: 'Не начался', name: 'upcoming' },
  { id: 1, translation: 'Происходящий', name: 'ongoing' },
  { id: 2, translation: 'Завершенный', name: 'completed' },
  { id: 3, translation: 'Отмененный', name: 'cancelled' },
];

/**
 * Статус Зарегистрированного на Чемпионат.
 */
export const registrationStatus: TOptions[] = [
  { id: 0, translation: 'Активен', name: 'registered' },
  { id: 1, translation: 'Аннулирован', name: 'canceled' },
  { id: 2, translation: 'Запрещен', name: 'banned' },
];
export const registrationStatusMap: TOptionsMap = new Map(
  registrationStatus.map((elm) => [elm.name, { translation: elm.translation }])
);

/**
 * Статус Чемпионата.
 */
export const championshipStatusMap: TOptionsMap = new Map([
  ['upcoming', { translation: 'Не начался' }],
  ['ongoing', { translation: 'Происходящий' }],
  ['completed', { translation: 'Завершенный' }],
  ['cancelled', { translation: 'Отмененный' }],
]);

/**
 * Начальные значения объекта Race (заезд) в Соревновании/Этапе.
 */
export const raceInit: TRaceForForm = {
  number: 1,
  name: '',
  laps: 1,
  description: '',
  distance: 0,
  ascent: 0,
  trackGPX: undefined,
  trackGPXFile: null,
  trackGPXUrl: null,
  registeredRiders: [],
  categoriesAgeFemale: [],
  categoriesAgeMale: [],
};
