// ДТО для получение данных из календаря.

import { getAgeDetails, getDateTime } from '@/libs/utils/calendar';
import type { TDtoChampionship, TRaceRegistrationDto } from '@/types/dto.types';
import type {
  TChampionshipWithOrganizer,
  TOrganizerForClient,
  TParentChampionshipForClient,
  TRegisteredRiderFromDB,
} from '@/types/index.interface';
import { ObjectId } from 'mongoose';

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
  };

  // Приведение даты в вид yyyy-mm-dd
  const { isoDate: startDate } = getDateTime(championship.startDate);
  const { isoDate: endDate } = getDateTime(championship.endDate);
  const { isoDate: createdAt } = getDateTime(championship.createdAt);
  const { isoDate: updatedAt } = getDateTime(championship.updatedAt);

  return {
    _id: String(championship._id),
    organizer,
    parentChampionship,
    name: championship.name,
    urlSlug: championship.urlSlug,
    description: championship.description,
    trackGPX: championship.trackGPX,
    quantityStages: championship.quantityStages,
    stage: championship.stage,
    posterUrl: championship.posterUrl,
    status: championship.status,
    type: championship.type,
    bikeType: championship.bikeType,
    races: championship.races,
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
  championships: { _id: ObjectId; name: string; availableStage: number[] }[]
): { _id: string; name: string; availableStage: number[] }[] {
  return championships.map((championship) => ({
    _id: String(championship._id),
    name: championship.name,
    availableStage: championship.availableStage,
  }));
}

/**
 * ДТО Зарегистрированного райдера в Заезде.
 */
export function dtoRegisteredRider(
  riderRegistered: TRegisteredRiderFromDB
): TRaceRegistrationDto {
  const age = getAgeDetails(new Date(riderRegistered.rider.person.birthday));

  const image = riderRegistered.rider.imageFromProvider
    ? riderRegistered.rider.provider.image
    : riderRegistered.rider.image;

  const yearBirthday = getDateTime(riderRegistered.rider.person.birthday).year;
  return {
    _id: riderRegistered._id.toString(),
    raceNumber: riderRegistered.raceNumber,
    rider: {
      _id: riderRegistered.rider._id.toString(),
      id: riderRegistered.rider.id,
      firstName: riderRegistered.rider.person.firstName,
      lastName: riderRegistered.rider.person.lastName,
      gender: riderRegistered.rider.person.gender,
      ...age,
      yearBirthday,
      team: riderRegistered.teamVariable,
      city: riderRegistered.rider.city,
      image,
    },
    startNumber: riderRegistered.startNumber,
    status: riderRegistered.status,
    createdAt: riderRegistered.createdAt.toISOString(),
  };
}

/**
 * ДТО Зарегистрированных райдеров в Заезде.
 */
export function dtoRegisteredRiders(riders: TRegisteredRiderFromDB[]): TRaceRegistrationDto[] {
  return riders.map((rider) => dtoRegisteredRider(rider));
}
