// Небольшие утилиты для компоненты FormChampionship

import { raceInit } from '@/constants/championship';
import { content } from '@/libs/utils/text';
import { TRaceClient, TRaceForForm } from '@/types/index.interface';

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
  return races.map((race) => ({
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
    categoriesAgeFemale: race.categoriesAgeFemale,
    categoriesAgeMale: race.categoriesAgeMale,
  }));
}
