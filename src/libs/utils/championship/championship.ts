import { TChampionshipStatus, TChampionshipTypes } from '@/types/models.interface';
import { declineDays } from '../decline';
import { TStageDateDescription } from '@/types/index.interface';
import { getFullDaysFromDates } from '../calendar';
import { TDtoChampionship } from '@/types/dto.types';

type Stages = {
  stages: TStageDateDescription[] | undefined;
};
type Props = {
  championship: TDtoChampionship;
};

/**
 * Получение статусов Туров и Серий, Этапов и Одиночного соревнования.
 * Выбор функции обработки статуса.
 */
export function getStatusString({ championship }: Props) {
  if (championship.type === 'single' || championship.type === 'stage') {
    return getCSingleStatusStr(championship);
  } else {
    return getStatusStagesString({
      stages: championship.stageDateDescription,
    });
  }
}
/**
 * Формирование строки Статуса Серии и Тура на основе Этапов.
 */
function getStatusStagesString({ stages }: Stages): string {
  if (!stages) {
    return 'нет данных...';
  }

  // Поиск проходящих сегодня Этапов.
  const ongoingStage = stages.find((stage) => stage.status === 'ongoing');

  if (ongoingStage) {
    return `Проводится сегодня ${ongoingStage.stageOrder} Этап`;
  }

  const upcomingStage = stages.find((stage) => stage.status === 'upcoming');

  // Если нет предстоящих (upcoming) Этапов, значит Чемпионат завершен.
  // Проходящих сегодня (ongoing) не может быть, так как это условие проверялось раньше.
  if (!upcomingStage) {
    return 'Завершен';
  }

  const today = new Date();
  const fullDaysFromToday = getFullDaysFromDates({
    startDate: today,
    endDate: upcomingStage.startDate,
  });

  const remainingDaysString = declineDays(fullDaysFromToday);
  if (fullDaysFromToday === 1) {
    return `Завтра старт ${upcomingStage.stageOrder} Этапа`;
  }
  return `${upcomingStage.stageOrder} Этап через: ${remainingDaysString}`;
}

/**
 * Получение подробного состояния Одиночного ()single Чемпионата.
 */
function getCSingleStatusStr(championship: TDtoChampionship): string {
  switch (championship.status) {
    case 'upcoming':
      const today = new Date();
      const fullDaysFromToday = getFullDaysFromDates({
        startDate: today,
        endDate: new Date(championship.startDate),
      });

      const remainingDaysString = declineDays(fullDaysFromToday);
      if (fullDaysFromToday === 1) {
        return `Завтра старт`;
      }
      return `Старт через: ${remainingDaysString}`;

    case 'ongoing':
      return 'Проводится сегодня';

    case 'completed':
      return 'Завершен';

    default:
      return 'Отменен';
  }
}

/**
 * Указывает общее количество  и количество завершенных этапов.
 */
export function getStagesCompleted({ stages }: Stages): string {
  if (!stages) {
    return 'нет данных...';
  }
  const total = stages.length || 1;
  const completed = stages.filter((stage) => stage.status === 'completed').length;

  return `${completed}/${total}`;
}

/**
 * Определяет текущий статус чемпионата на основе его дат начала и окончания, а также текущего статуса.
 *
 * @param {Object} params - Объект с параметрами функции.
 * @param {TChampionshipStatus} params.status - Текущий статус чемпионата.
 * @param {Date} params.startDate - Дата начала чемпионата.
 * @param {Date} params.endDate - Дата окончания чемпионата.
 * @returns {TChampionshipStatus} - Возвращает текущий статус чемпионата ('upcoming', 'ongoing', 'completed' или возвращает текущий статус, если он уже завершен или отменен).
 */
export function getCurrentStatus({
  status,
  startDate,
  endDate,
}: {
  status: TChampionshipStatus;
  startDate: Date;
  endDate: Date;
}): TChampionshipStatus {
  // Если чемпионат уже завершен или отменен, возвращаем текущий статус без изменений
  if (status === 'completed' || status === 'cancelled') {
    return status;
  }

  const today = new Date();

  // Вычисляем количество полных дней от текущей даты до даты начала чемпионата
  const fullDaysFromStartAndToday = getFullDaysFromDates({
    startDate: today,
    endDate: startDate,
  });

  // Если дата начала чемпионата в будущем, статус - "предстоящий"
  if (fullDaysFromStartAndToday > 0) {
    return 'upcoming';
  }
  // Если чемпионат начинается сегодня, статус - "идущий"
  else if (fullDaysFromStartAndToday === 0) {
    return 'ongoing';
  }

  // Вычисляем количество полных дней от текущей даты до даты окончания чемпионата
  const fullDaysFromEndAndToday = getFullDaysFromDates({
    startDate: today,
    endDate,
  });

  // Если чемпионат еще не завершился, статус - "идущий"
  if (fullDaysFromEndAndToday >= 0) {
    return 'ongoing';
  }
  // В противном случае, чемпионат завершен
  else {
    return 'completed';
  }
}

/**
 * Рассчитывает среднюю скорость на основе расстояния и времени.
 * Возвращает результат в формате XX.XX.
 * Если параметры не переданы или некорректны, возвращает 0.
 *
 * @param {number} [distanceKm] - Расстояние в километрах.
 * @param {number} [timeMs] - Время в миллисекундах.
 * @returns {number} Средняя скорость в километрах в час или 0, если данные некорректны.
 */
export function calculateAverageSpeed(distanceKm?: number, timeMs?: number): number {
  // Проверяем наличие входных параметров.
  if (typeof distanceKm !== 'number' || typeof timeMs !== 'number' || timeMs === 0) {
    return 0; // Возвращаем 0 при ошибке или отсутствии параметров.
  }

  // Расчет средней скорости: расстояние (км) делим на время (часы).
  const timeHours = timeMs / 1000 / 60 / 60; // Преобразуем миллисекунды в часы.
  const averageSpeed = distanceKm / timeHours; // Средняя скорость в км/ч.

  // Округляем результат до одной десятичной.
  return +averageSpeed.toFixed(2);
}

/**
 * Заменяет латинские обозначения категорий на кириллические.
 * @param {string} category - Название категории, которую нужно преобразовать.
 * @returns {string} - Преобразованное название категории с кириллическими обозначениями.
 */
export function replaceCategorySymbols(category: string, fullName?: boolean): string {
  let result = category;

  // Заменяем "F" на "Ж"
  if (category.includes('F')) {
    result = fullName ? result.replace('F', 'женщины ') : result.replace('F', 'Ж');
  }

  // Заменяем "M" на "М"
  if (category.includes('M')) {
    result = fullName ? result.replace('M', 'мужчины ') : result.replace('M', 'М');
  }

  return result;
}

/**
 * Сортирует массив строковых категорий, содержащих буквы и числа (например, F18+, M20-29).
 * @param {string[]} categories - Массив категорий для сортировки.
 * @returns {string[]} Отсортированный массив категорий.
 */
export function sortCategoriesString(categories: string[]): string[] {
  return categories.sort((a, b) => {
    // Разбиваем строку на буквы и числа
    const aMatches = a.match(/[A-Za-z]+|[0-9]+/g);
    const bMatches = b.match(/[A-Za-z]+|[0-9]+/g);

    // Проверка на null, если строка не соответствует регулярному выражению
    if (!aMatches || !bMatches) {
      return 0;
    }

    const [aLetter, aNum] = aMatches;
    const [bLetter, bNum] = bMatches;

    // Сравниваем буквы (например, F должна идти перед M)
    if (aLetter !== bLetter) {
      return aLetter.localeCompare(bLetter);
    }

    // Сравниваем числовые значения
    return parseInt(aNum) - parseInt(bNum);
  });
}

/**
 * Получение массива названий кнопок навигации на странице редактирования чемпионата, которые необходимо скрыть, в зависимости от типа чемпионата.
 */
export function getHiddenButtonNamesForEditChamp(
  type: TChampionshipTypes
): ('races' | 'main' | 'categories')[] {
  if (['series', 'tour'].includes(type)) {
    return ['races'];
  } else if (['stage'].includes(type)) {
    return ['categories'];
  }
  return [];
}

/**
 * Является чемпионат туром или серией заездов.
 */
export function isChampionshipWithStages(type: TChampionshipTypes): boolean {
  return ['series', 'tour'].includes(type);
}
