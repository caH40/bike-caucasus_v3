import { getDateTime } from '@/libs/utils/calendar';
import type { TDtoChampionship, TToursAndSeriesDto } from '@/types/dto.types';
import type {
  TChampionshipWithOrganizer,
  TOrganizerForClient,
  TParentChampionshipForClient,
} from '@/types/index.interface';

import { formatTRacesToClient } from './registration-champ';
import { TGetToursAndSeriesFromMongo } from '@/types/mongo.types';
import { racePointsTableDto } from './race-points-table';

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
  const organizer: TOrganizerForClient = {
    ...championship.organizer,
    _id: String(championship.organizer._id),
  };

  const parentChampionship: TParentChampionshipForClient = championship.parentChampionship && {
    ...championship.parentChampionship,
    _id: String(championship.parentChampionship._id),
    racePointsTable: String(championship.parentChampionship.racePointsTable),
  };

  // Приведение даты в вид yyyy-mm-dd
  const { isoDate: startDate } = getDateTime(championship.startDate);
  const { isoDate: endDate } = getDateTime(championship.endDate);
  const { isoDate: createdAt } = getDateTime(championship.createdAt);
  const { isoDate: updatedAt } = getDateTime(championship.updatedAt);

  const categories = championship.categoriesConfigs?.map((cat) => {
    const _id = String(cat._id);

    return {
      _id,
      name: cat.name,
      age: cat.age,
      skillLevel: cat.skillLevel,
    };
  });

  return {
    _id: String(championship._id),
    organizer,
    parentChampionship,
    name: championship.name,
    urlSlug: championship.urlSlug,
    description: championship.description,
    quantityStages: championship.quantityStages,
    stageOrder: championship.stageOrder,
    posterUrl: championship.posterUrl,
    isCountedStageInGC: championship.isCountedStageInGC,
    requiredStage: championship.requiredStage,
    awardedProtocols: championship.awardedProtocols,
    status: championship.status,
    type: championship.type,
    categoriesConfigs: categories,
    bikeType: championship.bikeType,
    racePointsTable:
      championship.racePointsTable && racePointsTableDto(championship.racePointsTable),
    races: formatTRacesToClient(championship.races),
    startDate,
    endDate,
    createdAt,
    updatedAt,
    stageDateDescription: championship.stageDateDescription,
  };
}

/**
 * ДТО массива Туров и Серий.
 */
export function dtoToursAndSeries(
  championships: (TGetToursAndSeriesFromMongo & {
    availableStage: number[];
  })[]
): TToursAndSeriesDto[] {
  return championships.map((champ) => ({
    ...champ,
    startDate: champ.startDate.toISOString(),
    endDate: champ.endDate.toISOString(),
    _id: String(champ._id),
  }));
}
