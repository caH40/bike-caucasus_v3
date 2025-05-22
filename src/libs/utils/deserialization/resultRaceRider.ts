import { TResultRaceRiderDeserialized } from '@/types/index.interface';

/**
 * Десериализация данных результата райдера в Заезде Чемпионата.
 */
export function deserializationResultRaceRider(
  dataSerialized: FormData
): TResultRaceRiderDeserialized {
  const resultRaceRider = {} as TResultRaceRiderDeserialized & {
    [key: string]: any;
  };

  for (const [key, value] of dataSerialized) {
    if (value === 'null') {
      resultRaceRider[key] = null;
      continue;
    } else if (
      (key === 'timeDetailsInMilliseconds' ||
        key === 'startNumber' ||
        key === 'raceNumber' ||
        key === 'yearBirthday') &&
      typeof value === 'string'
    ) {
      resultRaceRider[key] = +value;
      continue;
    }
    resultRaceRider[key] = value;
  }

  return resultRaceRider;
}
