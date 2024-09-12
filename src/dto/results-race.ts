import { TResultRaceDto, TResultRaceRiderDto } from '@/types/dto.types';
import { TResultRaceFromDB, TResultRaceRideFromDB } from '@/types/index.interface';

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

/**
 * Дто данных результата райдера в соревновании для Профиля пользователя.
 */
export function dtoResultRaceRider(result: TResultRaceRideFromDB): TResultRaceRiderDto {
  const resultDto = {} as TResultRaceRiderDto;
  // 'name', 'urlSlug', 'races'
  const raceCurrent = result.championship.races.find(
    (race) => (race.number = result.raceNumber)
  );

  if (!raceCurrent) {
    throw new Error(
      `Не найден заезд №${result.raceNumber} в Чемпионате ${result.championship.name}`
    );
  }

  const raceFiltered = {
    number: raceCurrent.number,
    name: raceCurrent.name,
    description: raceCurrent.description,
    laps: raceCurrent.laps,
    distance: raceCurrent.distance,
    ascent: raceCurrent.ascent,
  };

  const championship = {
    name: result.championship.name,
    urlSlug: result.championship.urlSlug,
    endDate: new Date(result.championship.endDate).getTime(),
    race: raceFiltered,
  };

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
export function dtoResultsRaceRider(results: TResultRaceRideFromDB[]): TResultRaceRiderDto[] {
  return results.map((result) => dtoResultRaceRider(result));
}
