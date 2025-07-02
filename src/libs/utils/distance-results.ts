import { TDistanceResultForSave, TGender } from '@/types/index.interface';
import { TGapsInCategories } from '@/types/models.interface';

type Params = (Omit<TDistanceResultForSave, 'positions' | 'gaps' | 'quantityRidersFinished'> & {
  gender: TGender;
})[];

/**
 * Обрабатывает результаты заезда, обновляет счетчики и категории.
 *
 * @param {Object} params - Параметры для обработки результатов.
 * @param {TResultRace[]} params.results - Массив результатов заезда.
 * @param {TRace} params.race - Данные заезда.
 */
export function processDistanceResults(results: Params): TDistanceResultForSave[] {
  // Инициализация счетчиков.
  const counters = {
    positionAbsolute: 1,
    positionAbsoluteMale: 1,
    positionAbsoluteFemale: 1,
    ridersFinishedAbsolute: 0,
    ridersFinishedAbsoluteMale: 0,
    ridersFinishedAbsoluteFemale: 0,
  };

  // Расчет позиции на дистанции в абсолютных протоколах.
  const resultsWithPositions = results.map((result) => {
    // Инициализация объекта позиций по протоколам.
    const positions = {
      absoluteGender: 0,
      absolute: 0,
    };

    // Если результат не для ранкинговых таблиц (не лучший у райдера), то присваиваются нулевые позиции.
    if (!result.isBestForRank) {
      return { ...result, positions };
    }

    if (result.gender === 'female') {
      positions.absoluteGender = counters.positionAbsoluteFemale;
      counters.positionAbsoluteFemale++;
      counters.ridersFinishedAbsoluteFemale++;
    } else {
      positions.absoluteGender = counters.positionAbsoluteMale;
      counters.positionAbsoluteMale++;
      counters.ridersFinishedAbsoluteMale++;
    }

    positions.absolute = counters.positionAbsolute;
    counters.positionAbsolute++;
    counters.ridersFinishedAbsolute++;

    return { ...result, positions } satisfies Omit<
      TDistanceResultForSave,
      'gaps' | 'quantityRidersFinished'
    > & { gender: TGender };
  });

  // Добавление счетчиков финишировавших в категориях.
  const resultsWithCounters = resultsWithPositions.map((result) => ({
    ...result,
    quantityRidersFinished: {
      absolute: counters.ridersFinishedAbsolute,
      absoluteGenderMale: counters.ridersFinishedAbsoluteMale,
      absoluteGenderFemale: counters.ridersFinishedAbsoluteFemale,
    },
  })) satisfies (Omit<TDistanceResultForSave, 'gaps'> & { gender: TGender })[];

  // Инициализация коллекции мест по категориям.
  const categoriesInRace = new Map<string, number>([
    ['absolute', 1],
    ['absoluteMale', 1],
    ['absoluteFemale', 1],
  ]);

  // Количество отставаний.
  const resultsForSave = setGaps({
    results: resultsWithCounters,
    categoriesInRace,
  });

  return resultsForSave;
}

type ResultsWithGenderWithoutGaps = Omit<TDistanceResultForSave, 'gaps'> & { gender: TGender };
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
  results: ResultsWithGenderWithoutGaps[];
  categoriesInRace: Map<string, number>;
}): TDistanceResultForSave[] {
  const indexesInCategories: {
    [key: string]: { leader: number | null; prev: number };
  } = {};

  // Инициализация счетчиков лидеров и предыдущих участников для всех категорий.
  for (const key of categoriesInRace.keys()) {
    indexesInCategories[key] = { leader: null, prev: 0 };
  }

  const { resultsForRank, otherResults } = results.reduce<
    Record<'resultsForRank' | 'otherResults', ResultsWithGenderWithoutGaps[]>
  >(
    (acc, cur) => {
      if (cur.isBestForRank) {
        acc.resultsForRank.push(cur);
      } else {
        acc.otherResults.push(cur);
      }
      return acc;
    },
    {
      resultsForRank: [],
      otherResults: [],
    }
  );

  // Расчет и установка отставаний для результатов из общего рейтинга.
  const resultsForRankForSave = resultsForRank.map((resultWithGender, index) => {
    const { gender, ...result } = resultWithGender;

    // Инициализация полей gapsInCategories.
    const gaps = {
      absolute: null,
      absoluteGenderMale: null,
      absoluteGenderFemale: null,
    } as Omit<TGapsInCategories, 'category'>;

    // Если результат не для ранкинговых таблиц (не лучший у райдера), то присваиваются нулевые отставания.
    if (!result.isBestForRank) {
      return { ...result, gaps };
    }

    // ============== 1. Расчет гэпов для абсолютного зачета. ==============
    if (index === 0) {
      // Лидер в абсолюте.
      indexesInCategories['absolute'].leader = index;
    } else {
      gaps.absolute = calculateGaps(resultsForRank, index, 0, index - 1);
    }

    // 2. Расчет гэпов для пола.
    if (gender === 'female') {
      if (indexesInCategories['absoluteFemale'].leader === null) {
        indexesInCategories['absoluteFemale'].leader = index; // Лидер среди женщин.
        indexesInCategories['absoluteFemale'].prev = index; // Предыдущий среди женщин.
      } else {
        gaps.absoluteGenderFemale = calculateGaps(
          resultsForRank,
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
        gaps.absoluteGenderMale = calculateGaps(
          resultsForRank,
          index,
          indexesInCategories['absoluteMale']!.leader,
          indexesInCategories['absoluteMale'].prev
        );
        indexesInCategories['absoluteMale'].prev = index; // Установка счетчика предыдущего райдера.
      }
    }

    return { ...result, gaps } satisfies TDistanceResultForSave;
  });

  // Результаты не для рейтинга. Повторные результаты райдеров, но не лучшие.
  const otherResultsForSave = otherResults.map((resultWithGender) => {
    const gaps = {
      absolute: null,
      absoluteGenderMale: null,
      absoluteGenderFemale: null,
    };
    return { ...resultWithGender, gaps };
  });

  return [...resultsForRankForSave, ...otherResultsForSave];
}

/**
 * Рассчитывает временные гэпы.
 * @param index Индекс текущего райдера.
 * @param leaderIndex Индекс лидера в категории.
 * @param prevIndex Индекс предыдущего райдера в категории.
 * @returns Объект с гэпами к лидеру и предыдущему райдеру.
 */
function calculateGaps(
  results: (Omit<TDistanceResultForSave, 'gaps'> & {
    gender: TGender;
  })[],
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
