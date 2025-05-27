import { TRacePointsTableDto } from '@/types/dto.types';
import { TRacePointsTable } from '@/types/models.interface';

/**
 * ДТО очковой таблицы.
 */
export function racePointsTableDto(racePointsTable: TRacePointsTable): TRacePointsTableDto {
  return {
    ...racePointsTable,
    _id: racePointsTable._id.toString(),
    organizer: racePointsTable.organizer.toString(),
    createdAt: racePointsTable.createdAt.toISOString(),
    updatedAt: racePointsTable.updatedAt.toISOString(),
  };
}
