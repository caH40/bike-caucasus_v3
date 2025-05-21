import { getAgeDetails, getDateTime } from '@/libs/utils/calendar';
import type {
  TChampRegistrationRiderDto,
  TCheckRegisteredInChampDto,
  TRaceRegistrationDto,
  TRegistrationRiderDto,
} from '@/types/dto.types';
import type {
  TChampionshipForRegisteredClient,
  TRaceForForm,
  TRegisteredRiderFromDB,
  TRegistrationRiderFromDB,
} from '@/types/index.interface';
import { TRace } from '@/types/models.interface';

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
    raceId: riderRegistered.race.toString(),
    rider: {
      _id: riderRegistered.rider._id.toString(),
      id: riderRegistered.rider.id,
      firstName: riderRegistered.rider.person.firstName,
      lastName: riderRegistered.rider.person.lastName,
      patronymic: riderRegistered.rider.person.patronymic,
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
  championship,
  races,
}: {
  riders: TRegisteredRiderFromDB[];
  championship: TChampionshipForRegisteredClient;
  races: TRace[];
}): {
  champRegistrationRiders: TChampRegistrationRiderDto[];
  championship: TChampionshipForRegisteredClient;
} {
  const ridersAfterDto = riders.map((rider) => dtoRegisteredRider(rider));

  const champRegistrationRiders = races.map((race) => ({
    raceNumber: race.number,
    raceName: race.name,
    raceRegistrationRider: ridersAfterDto.filter(
      (rider) => rider.raceId === race._id.toString()
    ),
  }));

  return { championship, champRegistrationRiders };
}

/**
 * Дто данных по Регистрации Райдера в Чемпионате.
 */
function dtoRegistrationRider(registration: TRegistrationRiderFromDB): TRegistrationRiderDto {
  // Получение race из объекта Чемпионата у которого raceNumber совпадает с raceNumber из Регистрации.
  const race = formatTRacesToClient(registration.championship.races).find(
    (race) => race.number === registration.raceNumber
  );

  if (!race) {
    throw new Error('Не найден raceNumber из регистрации в Races Чемпионата!');
  }

  return {
    _id: registration._id.toString(),
    riderId: registration.rider.toString(),
    championship: {
      _id: registration.championship._id.toString(),
      name: registration.championship.name,
      urlSlug: registration.championship.urlSlug,
      startDate: registration.championship.startDate,
      endDate: registration.championship.endDate,
      status: registration.championship.status,
      type: registration.championship.type,
      race,
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
export function dtoRegistrationsRider(
  registrations: TRegistrationRiderFromDB[]
): TRegistrationRiderDto[] {
  return registrations.map((registration) => dtoRegistrationRider(registration));
}

// ===================================================================================
export function formatTRacesToClient(races: TRace[]): TRaceForForm[] {
  return races.map((race) => {
    const _id = String(race._id);
    const categories = String(race.categories);
    const championship = String(race.championship);
    const registeredRiders = race.registeredRiders.map((rider) => String(rider));

    return { ...race, registeredRiders, categories, _id, championship };
  });
}

/**
 * Дто данных проверки активной регистрации райдера в запрашиваемом Чемпионате во всех заездах.
 */
export function dtoCheckRegisteredInChamp(
  registeredInChamp: TRegistrationRiderFromDB | null
): TCheckRegisteredInChampDto | null {
  if (!registeredInChamp) {
    return null;
  }

  return {
    race: {
      number: registeredInChamp.race.number,
      name: registeredInChamp.race.name,
      description: registeredInChamp.race.description,
      laps: registeredInChamp.race.laps,
      distance: registeredInChamp.race.distance,
      ascent: registeredInChamp.race.ascent,
    },
    startNumber: registeredInChamp.startNumber,
  };
}
