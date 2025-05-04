import { TOptions } from '@/types/index.interface';

/**
 * Кнопки для выбора способа ввода данных райдера для занесения результата в финишный протокол.
 */
export const buttonsForRiderRaceResult: TOptions[] = [
  { id: 0, translation: 'Зарегистрированные', name: 'registered' },
  { id: 1, translation: 'Поиск', name: 'search' },
  // { id: 2, translation: 'Ручной ввод', name: 'manual' },
];

/**
 * Кнопки для выбора отображения Общих протоколов или протоколов с делением по возрастным категориям.
 */
export const buttonsForProtocolRace: TOptions[] = [
  { id: 0, translation: 'Общие', name: 'overall' },
  { id: 1, translation: 'Возрастные категории', name: 'age' },
];

/**
 * Кнопки для выбора пола.
 */
export const buttonsGender: TOptions[] = [
  { id: 0, translation: 'Мужские', name: 'male' },
  { id: 1, translation: 'Женские', name: 'female' },
];

/**
 * Кнопки для выбора форм для заполнения данных чемпионата.
 */
export const championshipFormNavigationButtons: TOptions[] = [
  { id: 0, translation: 'Основные', name: 'main' },
  { id: 1, translation: 'Категории', name: 'categories' },
  { id: 2, translation: 'Заезды', name: 'races' },
];
