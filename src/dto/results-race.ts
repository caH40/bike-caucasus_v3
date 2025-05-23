import { TResultRaceDto, TRiderRaceResultDto } from '@/types/dto.types';
import { TResultRaceFromDB, TRiderRaceResultDB } from '@/types/index.interface';

export function dtoResultRace(result: TResultRaceFromDB): TResultRaceDto {
  const _id = String(result._id);
  const creator = String(result.creator);
  const createdAt = new Date(result.createdAt).getTime();
  const updatedAt = new Date(result.updatedAt).getTime();
  const championship = String(result.championship);
  const race = result.race.toString();
  return {
    ...result,
    race,
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

/**
 * Дто данных результата райдера в соревновании для Профиля пользователя.
 */
export function dtoResultRaceRider(result: TRiderRaceResultDB): TRiderRaceResultDto {
  const resultDto = {} as TRiderRaceResultDto;

  const raceFiltered = {
    number: result.race.number,
    name: result.race.name,
    description: result.race.description,
    laps: result.race.laps,
    distance: result.race.distance,
    ascent: result.race.ascent,
  };

  const championship = {
    name: result.championship.name,
    urlSlug: result.championship.urlSlug,
    endDate: new Date(result.championship.endDate).getTime(),
    race: raceFiltered,
  };

  resultDto._id = String(result._id);
  resultDto.profile = result.profile;
  resultDto.startNumber = result.startNumber;
  resultDto.raceTimeInMilliseconds = result.raceTimeInMilliseconds;
  resultDto.positions = result.positions;
  resultDto.points = result.points;
  resultDto.disqualification = result.disqualification;
  resultDto.categoryAge = result.categoryAge;
  resultDto.categorySkillLevel = result.categorySkillLevel;
  resultDto.averageSpeed = result.averageSpeed;
  resultDto.lapTimes = result.lapTimes;
  resultDto.remarks = result.remarks;
  resultDto.quantityRidersFinished = result.quantityRidersFinished;
  resultDto.championship = championship;

  return resultDto;
}

/**
 * Дто данных результатов райдера в соревнованиях для Профиля пользователя.
 */
export function dtoResultsRaceRider(results: TRiderRaceResultDB[]): TRiderRaceResultDto[] {
  return results.map((result) => dtoResultRaceRider(result));
}
