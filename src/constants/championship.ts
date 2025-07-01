import type {
  TOptions,
  TOptionsMap,
  TRaceForFormNew,
  TSurfaceType,
} from '@/types/index.interface';
import { SURFACE_TYPE_TRANSLATIONS } from './translations';

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
  ['series', { translation: 'Серия заездов' }],
  ['tour', { translation: 'Тур' }],
  ['stage', { translation: 'Этап' }],
]);

/**
 * Тип дорожного покрытия дистанции.
 */
export const distanceSurfaceTypes: TOptions<TSurfaceType>[] = (
  Object.entries(SURFACE_TYPE_TRANSLATIONS) as [TSurfaceType, string][]
).map(([name, translation], index) => ({
  id: index,
  name,
  translation,
}));

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

export const DEFAULT_STANDARD_CATEGORIES = {
  name: 'Стандартный',
  description: 'Стандартные категории. Мужчины 18+. Женщины 18+.',
  age: {
    female: [
      {
        min: 18,
        max: 120,
        name: 'Ж18+',
      },
    ],
    male: [
      {
        min: 18,
        max: 120,
        name: 'М18+',
      },
    ],
  },
  skillLevel: undefined,
};

/**
 * Начальные значения объекта Race (заезд) в Соревновании/Этапе.
 */
export const raceInit: TRaceForFormNew = {
  number: 1,
  name: '',
  laps: 1,
  description: '',
  distance: 0,
  ascent: 0,
  _id: undefined, // При инициализации эти свойства не определены.
  categories: undefined, // При инициализации эти свойства не определены.
  trackGPX: undefined, // При инициализации эти свойства не определены.
  trackGPXFile: null,
  trackGPXUrl: null,
  quantityRidersFinished: 0,
  trackDistance: 'null',
};
