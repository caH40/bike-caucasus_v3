import { TResultRaceDto } from '@/types/dto.types';
import { TResultRaceFromDB } from '@/types/index.interface';

export function dtoResultRace(result: TResultRaceFromDB): TResultRaceDto {
  const _id = String(result._id);
  const creator = String(result.creator);
  const createdAt = new Date(result.createdAt).getTime();
  const updatedAt = new Date(result.updatedAt).getTime();
  const championship = String(result.championship);
  return {
    ...result,
    _id,
    creator,
    championship,
    createdAt,
    updatedAt,
  };
}

export function dtoResultsRace(results: TResultRaceFromDB[]): TResultRaceDto[] {
  return results.map((result) => dtoResultRace(result));
}
