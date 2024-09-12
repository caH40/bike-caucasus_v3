import { TRace, TResultRaceDocument } from '@/types/models.interface';
import { getCategoryAge } from './age-category';
import { calculateAverageSpeed } from './championship';

/**
 * Обрабатывает результаты заезда, обновляет счетчики и категории.
 *
 * @param {Object} params - Параметры для обработки результатов.
 * @param {TResultRaceDocument[]} params.results - Массив результатов заезда.
 * @param {TRace} params.race - Данные заезда.
 */
export function processResults({
  results,
  race,
}: {
  results: TResultRaceDocument[];
  race: TRace;
}): {
  resultsUpdated: TResultRaceDocument[];
  quantityRidersFinished: number;
} {
  // Инициализация коллекции мест по категориям.
  const categoriesInRace = new Map<string, number>([
    ['absolute', 1],
    ['absoluteMale', 1],
    ['absoluteFemale', 1],
  ]);

  // Обновление данных результатов.
  results.forEach((result) => {
    const isFemale = result.profile.gender === 'female';
    const categoryAge = getCategoryAge({
      yearBirthday: result.profile.yearBirthday,
      categoriesAge: isFemale ? race.categoriesAgeFemale : race.categoriesAgeMale,
      gender: isFemale ? 'F' : 'M',
    });

    result.categoryAge = categoryAge;
    categoriesInRace.set(categoryAge, 1);
  });

  // Количество финишировавших в категориях.
  const quantityRidersFinishedMap = getQuantityRidersFinished({
    results,
    categoriesInRace,
  });

  // Сортировка по финишному времени.
  results.sort((a, b) => a.raceTimeInMilliseconds - b.raceTimeInMilliseconds);

  // Количество финишировавших в категориях.
  setGaps({
    results,
    categoriesInRace,
  });

  // Установка мест и средней скорости.
  results.forEach((result) => {
    setPositions(result, categoriesInRace, quantityRidersFinishedMap);
    result.averageSpeed = calculateAverageSpeed(race.distance, result.raceTimeInMilliseconds);
  });

  return {
    resultsUpdated: [...results],
    quantityRidersFinished: quantityRidersFinishedMap.get('absolute') || 0,
  };
}

/**
 * Устанавливает позиции для результатов и обновляет счетчики в коллекциях категорий.
 *
 * @param {TResultRaceDocument} result - Результат заезда.
 * @param {Map<string, number>} categoriesInRace - Коллекция категорий и счетчиков.
 * @param {Map<string, number>} quantityRidersFinishedMap - Коллекция количества финишировавших в категориях.
 */
export function setPositions(
  result: TResultRaceDocument,
  categoriesInRace: Map<string, number>,
  quantityRidersFinishedMap: Map<string, number>
) {
  const isFemale = result.profile.gender === 'female';

  result.quantityRidersFinished = {
    category: quantityRidersFinishedMap.get(result.categoryAge) || 0,
    absolute: quantityRidersFinishedMap.get('absolute')!,
    absoluteGenderFemale: isFemale ? quantityRidersFinishedMap.get('absoluteFemale')! : 0,
    absoluteGenderMale: !isFemale ? quantityRidersFinishedMap.get('absoluteMale')! : 0,
  };

  result.positions.absolute = categoriesInRace.get('absolute')!;
  categoriesInRace.set('absolute', result.positions.absolute + 1);

  if (isFemale) {
    result.positions.absoluteGender = categoriesInRace.get('absoluteFemale')!;
    categoriesInRace.set('absoluteFemale', result.positions.absoluteGender + 1);
  } else {
    result.positions.absoluteGender = categoriesInRace.get('absoluteMale')!;
    categoriesInRace.set('absoluteMale', result.positions.absoluteGender + 1);
  }

  const positionAge = categoriesInRace.get(result.categoryAge);
  if (positionAge) {
    result.positions.category = positionAge;
    categoriesInRace.set(result.categoryAge, positionAge + 1);
  }
}

/**
 * Количество финишировавших в разных категориях.
 *
 * Этот метод обновляет количество финишировавших в категориях на основе результатов заездов и
 * категории, присутствующих в `categoriesInRace`.
 *
 * @param {Object} params - Параметры для вычисления количества финишировавших.
 * @param {TResultRaceDocument[]} params.results - Массив результатов заезда.
 * @param {Map<string, number>} params.categoriesInRace - Коллекция категорий и счетчиков.
 * @returns {Map<string, number>} Коллекция количества финишировавших в категориях.
 */
export function getQuantityRidersFinished({
  results,
  categoriesInRace,
}: {
  results: TResultRaceDocument[];
  categoriesInRace: Map<string, number>;
}): Map<string, number> {
  const ridersInCategories = new Map<string, number>();

  // Инициализация счетчиков для всех категорий с нуля.
  for (const key of categoriesInRace.keys()) {
    ridersInCategories.set(key, 0);
  }

  return results.reduce((acc, cur) => {
    // Проверка и обновление счетчика для возрастной категории.
    if (ridersInCategories.has(cur.categoryAge)) {
      const valueCategory = ridersInCategories.get(cur.categoryAge) || 0;
      ridersInCategories.set(cur.categoryAge, valueCategory + 1);
    }

    // Увеличение счетчика для женской категории.
    if (cur.profile.gender === 'female') {
      const valueFemale = ridersInCategories.get('absoluteFemale') || 0;
      ridersInCategories.set('absoluteFemale', valueFemale + 1);
    }

    // Увеличение счетчика для мужской категории.
    if (cur.profile.gender === 'male') {
      const valueMale = ridersInCategories.get('absoluteMale') || 0;
      ridersInCategories.set('absoluteMale', valueMale + 1);
    }

    // Увеличение счетчика для абсолютной категории.
    const valueAbsolute = ridersInCategories.get('absolute') || 0;
    ridersInCategories.set('absolute', valueAbsolute + 1);

    return ridersInCategories;
  }, ridersInCategories);
}

/**
 * Рассчитывает и устанавливает временные гэпы между райдерами для различных категорий.
 *
 * @param results Массив результатов заезда.
 * @param categoriesInRace Коллекция категорий с количеством участников.
 */
export function setGaps({
  results,
  categoriesInRace,
}: {
  results: TResultRaceDocument[];
  categoriesInRace: Map<string, number>;
}) {
  const indexesInCategories: {
    [key: string]: { leader: number | null; prev: number };
  } = {};

  // Инициализация счетчиков лидеров и предыдущих участников для всех категорий.
  for (const key of categoriesInRace.keys()) {
    indexesInCategories[key] = { leader: null, prev: 0 };
  }

  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    const categoryAge = result.categoryAge;
    const gender = result.profile.gender;

    // Инициализация полей gapsInCategories.
    result.gapsInCategories = {
      absolute: null,
      category: null,
      absoluteGenderMale: null,
      absoluteGenderFemale: null,
    };

    // 1. Расчет гэпов для абсолютного зачета.
    if (index === 0) {
      // Лидер в абсолюте.
      indexesInCategories['absolute'].leader = index;
    } else {
      result.gapsInCategories.absolute = calculateGaps(results, index, 0, index - 1);
    }

    // 2. Расчет гэпов для возрастной категории.
    const indexLeaderCategory = indexesInCategories[categoryAge].leader; // Индекс лидера в категории.
    if (indexLeaderCategory === null) {
      indexesInCategories[categoryAge].leader = index; // Лидер в категории.
      indexesInCategories[categoryAge].prev = index; // Предыдущий в категории.
    } else {
      result.gapsInCategories.category = calculateGaps(
        results,
        index,
        indexLeaderCategory,
        indexesInCategories[categoryAge].prev
      );
      indexesInCategories[categoryAge].prev = index; // Установка счетчика предыдущего райдера.
    }

    // 3. Расчет гэпов для пола.
    if (gender === 'female') {
      if (indexesInCategories['absoluteFemale'].leader === null) {
        indexesInCategories['absoluteFemale'].leader = index; // Лидер среди женщин.
        indexesInCategories['absoluteFemale'].prev = index; // Предыдущий среди женщин.
      } else {
        result.gapsInCategories.absoluteGenderFemale = calculateGaps(
          results,
          index,
          indexesInCategories['absoluteFemale']!.leader,
          indexesInCategories['absoluteFemale'].prev
        );
        indexesInCategories['absoluteFemale'].prev = index; // Установка счетчика предыдущего райдера.
      }
    } else {
      if (indexesInCategories['absoluteMale'].leader === null) {
        indexesInCategories['absoluteMale'].leader = index; // Лидер среди мужчин.
        indexesInCategories['absoluteMale'].prev = index; // Предыдущий среди мужчин.
      } else {
        result.gapsInCategories.absoluteGenderMale = calculateGaps(
          results,
          index,
          indexesInCategories['absoluteMale']!.leader,
          indexesInCategories['absoluteMale'].prev
        );
        indexesInCategories['absoluteMale'].prev = index; // Установка счетчика предыдущего райдера.
      }
    }
  }
}

/**
 * Рассчитывает временные гэпы.
 *
 * @param index Индекс текущего райдера.
 * @param leaderIndex Индекс лидера в категории.
 * @param prevIndex Индекс предыдущего райдера в категории.
 * @returns Объект с гэпами к лидеру и предыдущему райдеру.
 */
function calculateGaps(
  results: TResultRaceDocument[],
  index: number,
  leaderIndex: number,
  prevIndex: number
) {
  const toLeader =
    results[index].raceTimeInMilliseconds - results[leaderIndex].raceTimeInMilliseconds;
  const toPrev =
    results[index].raceTimeInMilliseconds - results[prevIndex].raceTimeInMilliseconds;

  return { toLeader, toPrev };
}
