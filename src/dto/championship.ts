import { ObjectId } from 'mongoose';

import { getAgeDetails, getDateTime } from '@/libs/utils/calendar';
import type {
  TChampRegistrationRiderDto,
  TDtoChampionship,
  TRaceRegistrationDto,
  TRegistrationRiderDto,
} from '@/types/dto.types';
import type {
  TChampionshipWithOrganizer,
  TOrganizerForClient,
  TParentChampionshipForClient,
  TRegisteredRiderFromDB,
  TRegistrationRiderFromDB,
} from '@/types/index.interface';
import { TChampionshipTypes, TRace } from '@/types/models.interface';

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
    championship: riderRegistered.championship.toString(),
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

/**
 * ДТО Зарегистрированных райдеров в Чемпионате во всех заездах.
 */
export function dtoRegisteredRidersChamp({
  riders,
  races,
  championshipName,
  championshipType,
}: {
  riders: TRegisteredRiderFromDB[];
  races: TRace[];
  championshipName: string;
  championshipType: TChampionshipTypes;
}): {
  champRegistrationRiders: TChampRegistrationRiderDto[];
  championshipName: string;
  championshipType: TChampionshipTypes;
} {
  const ridersAfterDto = riders.map((rider) => dtoRegisteredRider(rider));

  const champRegistrationRiders = races.map((race) => ({
    raceNumber: race.number,
    raceName: race.name,
    raceRegistrationRider: ridersAfterDto.filter((rider) => rider.raceNumber === race.number),
  }));

  return { championshipName, championshipType, champRegistrationRiders };
}

/**
 * Дто данных по Регистрации Райдера в Чемпионате.
 */
function dtoRegistrationRider(registration: TRegistrationRiderFromDB): TRegistrationRiderDto {
  return {
    _id: registration._id.toString(),
    championship: {
      _id: registration._id.toString(),
      name: registration.championship.name,
      urlSlug: registration.championship.urlSlug,
      startDate: registration.championship.startDate,
      endDate: registration.championship.endDate,
      status: registration.championship.status,
      type: registration.championship.type,
      races: formatTRacesToClient(registration.championship.races),
      posterUrl: registration.championship.posterUrl,
    },
    parentChampionship: registration.championship.parentChampionship,
    raceNumber: registration.raceNumber,
    startNumber: registration.startNumber,
    status: registration.status,
    createdAt: registration.createdAt,
  };
}

/**
 * Дто данных по Регистраций (все регистрации) Райдера в Чемпионатах.
 */
export function DtoRegistrationsRider(
  registrations: TRegistrationRiderFromDB[]
): TRegistrationRiderDto[] {
  return registrations.map((registration) => dtoRegistrationRider(registration));
}

// ===================================================================================
function formatTRacesToClient(races: TRace[]) {
  return races.map((race) => {
    const registeredRiders = race.registeredRiders.map((rider) => String(rider));
    return { ...race, registeredRiders };
  });
}
