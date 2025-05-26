import { UseFormWatch } from 'react-hook-form';

import { raceInit } from '@/constants/championship';
import { content } from '@/libs/utils/text';

// types
import { TDtoChampionship, TToursAndSeriesDto } from '@/types/dto.types';
import {
  TClientCategoriesConfigs,
  TFormChampionshipCreate,
  TOptions,
  TRaceForForm,
  TRaceForFormNew,
} from '@/types/index.interface';

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
 * Преобразует массив конфигураций категорий в формат опций для селекта.
 * @param categoriesConfigs - Массив конфигураций категорий.
 * @returns Массив опций в формате для тега <select>.
 */
export function getCategoriesSelectOptions(
  categoriesConfigs: TClientCategoriesConfigs[]
): TOptions[] {
  return categoriesConfigs.map((c, index) => ({
    id: index,
    translation: c.name,
    name: c._id,
  }));
}

/**
 * Инициализирует массив гонок для формы на основе данных о гонках.
 */
export function getRacesInit(races?: TRaceForForm[]): TRaceForFormNew[] {
  // Если гонки отсутствуют, возвращаем массив с одной инициализированной гонкой.

  if (!races || races.length === 0) {
    return [raceInit];
  }
  // Мапируем гонки в формат, подходящий для использования в форме.
  return races.map((race) => {
    return {
      _id: race._id, // Номер гонки, инициализируется как 1.
      number: race.number, // Номер гонки, инициализируется как 1.
      name: race.name, // Название гонки.
      laps: race.laps, // Количество кругов в гонке.
      description: race.description, // Описание гонки.
      distance: race.distance, // Дистанция гонки.
      ascent: race.ascent, // Набор высоты в гонке.
      trackGPX: undefined, // Изначально пустое значение для трека в формате GPX.
      trackGPXFile: null, // Изначально отсутствует загруженный файл GPX.
      trackGPXUrl: race.trackGPX?.url || null, // URL для трека в формате GPX.
      quantityRidersFinished: race.quantityRidersFinished,
      categories: race.categories,
      championship: race.championship,
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
      elm._id ===
      (watch('parentChampionship')?._id || championshipForEdit?.parentChampionship?._id)
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
