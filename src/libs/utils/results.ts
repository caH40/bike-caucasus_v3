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

  return { resultsUpdated: [...results] };
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
 * Функция обновления отставаний от лидера в категории и от предыдущего райдера.
 */
export function setGaps({
  results,
  categoriesInRace,
}: {
  results: TResultRaceDocument[];
  categoriesInRace: Map<string, number>;
}) {
  const leadersInCategories = {} as {
    [key: string]: number | null;
  };

  // Инициализация счетчиков лидеров для всех категорий.
  for (const key of categoriesInRace.keys()) {
    leadersInCategories[key] = null;
  }

  // Функция для расчета гэпов.
  const calculateGaps = (index: number, leaderIndex: number, prevIndex: number) => {
    const toLeader =
      results[index].raceTimeInMilliseconds - results[leaderIndex].raceTimeInMilliseconds;
    const toPrev =
      results[index].raceTimeInMilliseconds - results[prevIndex].raceTimeInMilliseconds;
    return { toLeader, toPrev };
  };

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
      // Лидер в абсолюте
      leadersInCategories['absolute'] = index;
    } else {
      result.gapsInCategories.absolute = calculateGaps(index, 0, index - 1);
    }

    // 2. Расчет гэпов для возрастной категории.
    if (leadersInCategories[categoryAge] === null) {
      leadersInCategories[categoryAge] = index; // Лидер в категории
    } else {
      result.gapsInCategories.category = calculateGaps(
        index,
        leadersInCategories[categoryAge]!,
        index - 1
      );
    }

    // 3. Расчет гэпов для пола.
    if (gender === 'female') {
      if (leadersInCategories['absoluteFemale'] === null) {
        leadersInCategories['absoluteFemale'] = index; // Лидер среди женщин
      } else {
        result.gapsInCategories.absoluteGenderFemale = calculateGaps(
          index,
          leadersInCategories['absoluteFemale']!,
          index - 1
        );
      }
    } else {
      if (leadersInCategories['absoluteMale'] === null) {
        leadersInCategories['absoluteMale'] = index; // Лидер среди мужчин
      } else {
        result.gapsInCategories.absoluteGenderMale = calculateGaps(
          index,
          leadersInCategories['absoluteMale']!,
          index - 1
        );
      }
    }
  }
}
