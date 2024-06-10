import IconBikeDH from '@/components/Icons/IconBikeDH';
import IconBikeGravel from '@/components/Icons/IconBikeGravel';
import IconBikeMTB from '@/components/Icons/IconBikeMTB';
import IconBikeRoad from '@/components/Icons/IconBikeRoad';
import { TOptions } from '@/types/index.interface';

// Регион по которому проходит маршрут.
export const regions: TOptions[] = [
  { id: 0, translation: 'Ставропольский край', name: 'stavropolKrai' },
  { id: 1, translation: 'Карачаево-Черкесия', name: 'karachayCherkessia' },
  { id: 3, translation: 'Кабардино-Балкария', name: 'kabardinoBalkaria' },
  { id: 5, translation: 'Северная Осетия', name: 'northOssetia' },
  { id: 6, translation: 'Южная Осетия', name: 'southOssetia' },
  { id: 7, translation: 'Республика Дагестан', name: 'republicOfDagestan' },
  { id: 8, translation: 'Чеченская Республика', name: 'chechenRepublic' },
  { id: 9, translation: 'Краснодарский край', name: 'krasnodarKrai' },
  { id: 10, translation: 'Республика Адыгея', name: 'republicOfAdygea' },
  { id: 11, translation: 'Республика Ингушетия', name: 'republicOfIngushetia' },
];

// Уровни сложности маршрута.
export const difficultyLevel: TOptions[] = [
  { id: 0, translation: 'Лёгкий', name: 'easy' },
  { id: 1, translation: 'Средний', name: 'medium' },
  { id: 3, translation: 'Сложный', name: 'hard' },
  { id: 4, translation: 'Невыполнимый', name: 'impossible' },
];

// Уровни сложности маршрута.
export const bikeTypes: TOptions[] = [
  { id: 0, translation: 'Шоссейный', name: 'road', icon: IconBikeRoad },
  { id: 1, translation: 'Горный', name: 'mtb', icon: IconBikeMTB },
  { id: 3, translation: 'Грэвел', name: 'gravel', icon: IconBikeGravel },
  { id: 4, translation: 'Скоростной спуск', name: 'dh', icon: IconBikeDH },
];

// Уровни сложности маршрута.
export const sortCategories: TOptions[] = [
  { id: 0, translation: 'Набор высоты', name: 'ascent' },
  { id: 1, translation: 'Дистанция', name: 'distance' },
  // { id: 2, translation: 'Сложность', name: 'difficultyLevel' },
];
