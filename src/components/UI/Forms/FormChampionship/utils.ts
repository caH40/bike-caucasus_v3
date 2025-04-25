// Небольшие утилиты для компоненты FormChampionship

import { raceInit } from '@/constants/championship';
import { content } from '@/libs/utils/text';
import { TDtoChampionship, TToursAndSeriesDto } from '@/types/dto.types';
import {
  TFormChampionshipCreate,
  TOptions,
  TRaceClient,
  TRaceForForm,
} from '@/types/index.interface';
import { TCategoryAge } from '@/types/models.interface';
import { UseFormWatch } from 'react-hook-form';

type Params = {
  name: string;
  description: string;
};

/**
 * Очищает тексты Чемпионата от тэгов html, кроме <a>, <br>.
 * Заменяет символы CRLF перевода строк на html тэг <br>.
 */
export function formateAndStripContent({ name, description }: Params) {
  const nameStripedHtmlTags = content.stripHtmlTags(name);

  const textStripedHtmlTags = content.stripHtmlTags(description);
  const descriptionStripedHtmlTags = content.replaceCRLFtoBR(textStripedHtmlTags);
  const descriptionFormatted = content.replaceWithUrl(descriptionStripedHtmlTags);

  return {
    nameStripedHtmlTags,
    descriptionFormatted,
  };
}

/**
 * Инициализирует массив гонок для формы на основе данных о гонках.
 *
 * @param {TRace[] | undefined} races - Массив объектов гонок или undefined.
 * @returns {TRaceForForm[]} Массив объектов гонок, подготовленных для использования в форме.
 */
export function getRacesInit(races: TRaceClient[] | undefined): TRaceForForm[] {
  // Если гонки отсутствуют, возвращаем массив с одной инициализированной гонкой.

  if (!races) {
    return [raceInit];
  }
  // Мапируем гонки в формат, подходящий для использования в форме.
  return races.map((race) => {
    const categoriesAge = (categories: TCategoryAge[]) =>
      categories.map((cat) => ({
        min: String(cat.min),
        max: String(cat.max),
        name: cat.name ? cat.name : '',
      }));

    return {
      number: race.number, // Номер гонки, инициализируется как 1.
      name: race.name, // Название гонки.
      laps: race.laps, // Количество кругов в гонке.
      description: race.description, // Описание гонки.
      distance: race.distance, // Дистанция гонки.
      ascent: race.ascent, // Набор высоты в гонке.
      trackGPX: undefined, // Изначально пустое значение для трека в формате GPX.
      trackGPXFile: null, // Изначально отсутствует загруженный файл GPX.
      trackGPXUrl: race.trackGPX.url, // URL для трека в формате GPX.
      registeredRiders: race.registeredRiders || [],
      categoriesAgeFemale: categoriesAge(race.categoriesAgeFemale),
      categoriesAgeMale: categoriesAge(race.categoriesAgeMale),
      quantityRidersFinished: race.quantityRidersFinished,
    };
  });
}

/**
 * Создание массива опция для SelectCustom выбора Родительского Чемпионата.
 */
export function createParentOptions(parentChampionships: TToursAndSeriesDto[]): TOptions[] {
  const options = parentChampionships.map((elm, index) => ({
    id: index,
    translation: elm.name,
    name: elm._id,
  }));

  return options;
}

/**
 * Создание массива Этапов.
 */
export function createStageNumbers(
  parentChampionships: TToursAndSeriesDto[],
  watch: UseFormWatch<TFormChampionshipCreate>,
  championshipForEdit?: TDtoChampionship
): TOptions[] {
  // В массиве Туров и Серий находим выбранный parentChampionship.
  // Если не найден такой Тур или Серия, это ошибка.
  const parentChampionship = parentChampionships.find(
    (elm) =>
      elm._id === (watch('parentChampionship')?._id || championshipForEdit?.parentChampionship)
  );

  if (!parentChampionship) {
    return [];
  }

  const options = parentChampionship.availableStage.map((elm) => ({
    id: elm,
    translation: String(elm),
    name: String(elm),
  }));

  // Добавление текущего номера Этапа в Общий массив всех Свободных номеров Этапов в Серии или Туре.
  if (championshipForEdit?.stage) {
    options.push({
      id: championshipForEdit?.stage,
      translation: String(championshipForEdit?.stage),
      name: String(championshipForEdit?.stage),
    });
    options.sort((a, b) => +a.name - +b.name);
  }

  return options;
}
