import { createStringCategoryAge } from '@/libs/utils/string-category';
import { getAgeDetails, getDateTime } from '@/libs/utils/calendar';
import type {
  TChampRegistrationRiderDto,
  TCheckRegisteredInChampDto,
  TRaceRegistrationDto,
  TRegistrationRiderDto,
} from '@/types/dto.types';
import type {
  TRaceForForm,
  TRacesWithTDistance,
  TRaceWithCategories,
  TRegisteredRiderFromDB,
  TRegistrationRiderFromDB,
} from '@/types/index.interface';
import { TCategories } from '@/types/models.interface';

/**
 * ДТО Зарегистрированного райдера в Заезде.
 */
export function dtoRegisteredRider(
  riderRegistered: TRegisteredRiderFromDB,
  categories: TCategories
): TRaceRegistrationDto {
  const age = getAgeDetails(new Date(riderRegistered.rider.person.birthday));

  const image = riderRegistered.rider.imageFromProvider
    ? riderRegistered.rider.provider?.image
    : riderRegistered.rider.image;

  const gender = riderRegistered.rider.person.gender;
  const yearBirthday = getDateTime(riderRegistered.rider.person.birthday).year;

  // Определение категории в регистрации.
  const category: string = riderRegistered.categorySkillLevel
    ? riderRegistered.categorySkillLevel
    : createStringCategoryAge({ gender, yearBirthday, categoriesAge: categories.age[gender] });

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
      gender,
      ...age,
      yearBirthday,
      team: riderRegistered.teamVariable,
      city: riderRegistered.rider.city,
      image,
    },
    category,
    startNumber: riderRegistered.startNumber,
    status: riderRegistered.status,
    createdAt: riderRegistered.createdAt.toISOString(),
  };
}

/**
 * ДТО Зарегистрированных райдеров в Заезде.
 */
export function dtoRegisteredRiders(
  riders: TRegisteredRiderFromDB[],
  categories: TCategories // Пакет категорий для заезда.
): TRaceRegistrationDto[] {
  return riders.map((rider) => dtoRegisteredRider(rider, categories));
}

/**
 * ДТО Зарегистрированных райдеров в Чемпионате во всех заездах.
 */
export function dtoRegisteredInChampRiders({
  riders,
  race,
}: {
  riders: TRegisteredRiderFromDB[];
  race: TRaceWithCategories;
}): TChampRegistrationRiderDto {
  const ridersAfterDto = dtoRegisteredRiders(riders, race.categories);

  const registeredRidersInRace = {
    raceId: race._id.toString(),
    raceName: race.name,
    raceRegistrationRider: ridersAfterDto.filter(
      (rider) => rider.raceId === race._id.toString()
    ),
  };

  return registeredRidersInRace;
}

/**
 * Дто данных по Регистрации Райдера в Чемпионате.
 */
export function dtoRegistrationRider(
  registration: TRegistrationRiderFromDB
): TRegistrationRiderDto {
  // Получение race из объекта Чемпионата у которого raceNumber совпадает с raceNumber из Регистрации.
  const race = formatTRaceToClient(registration.race);

  if (!race) {
    throw new Error('Не найден raceNumber из регистрации в Races Чемпионата!');
  }

  return {
    _id: registration._id.toString(),
    rider: { gender: registration.rider.person.gender },
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
    startNumber: registration.startNumber,
    status: registration.status,
    createdAt: registration.createdAt,
  };
}

export function formatTRacesToClient(races: TRacesWithTDistance[]): TRaceForForm[] {
  return races.map((race) => formatTRaceToClient(race));
}
export function formatTRaceToClient(race: TRacesWithTDistance): TRaceForForm {
  const _id = String(race._id);
  const trackGPX = race.trackDistance ? race.trackDistance.trackGPX : race.trackGPX;

  const trackDistance = race.trackDistance ? race.trackDistance._id.toString() : null;
  const categories = String(race.categories);
  const championship = String(race.championship);
  const registeredRiders = race.registeredRiders.map((rider) => String(rider));

  return { ...race, registeredRiders, categories, _id, championship, trackDistance, trackGPX };
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
