// ДТО для получение данных из календаря.

import { getDateTime } from '@/libs/utils/calendar';
import type { TAuthor, TDtoChampionship } from '@/types/dto.types';
import type { TChampionshipWithOrganizer } from '@/types/index.interface';

/**
 * ДТО массива Чемпионатов.
 */
export function dtoChampionships(
  championships: TChampionshipWithOrganizer[]
): TDtoChampionship[] {
  return championships.map((championship) => dtoChampionship(championship));
}

/**
 * ДТО Чемпионата.
 */
export function dtoChampionship(championship: TChampionshipWithOrganizer): TDtoChampionship {
  const organizer: TAuthor = {
    ...championship.organizer,
    _id: String(championship.organizer._id),
  };

  // Приведение даты в вид yyyy-mm-dd
  const { isoDate: startDate } = getDateTime(championship.startDate);
  const { isoDate: endDate } = getDateTime(championship.endDate);
  const { isoDate: createdAt } = getDateTime(championship.createdAt);
  const { isoDate: updatedAt } = getDateTime(championship.updatedAt);

  return {
    _id: String(championship._id),
    organizer,
    name: championship.name,
    urlSlug: championship.urlSlug,
    description: championship.description,
    trackGPX: championship.trackGPX,
    parentChampionshipUrl: championship.parentChampionshipUrl,
    childChampionshipUrls: championship.childChampionshipUrls,
    posterUrl: championship.posterUrl,
    status: championship.status,
    championshipType: championship.championshipType,
    bikeType: championship.bikeType,
    startDate,
    endDate,
    createdAt,
    updatedAt,
  };
}
