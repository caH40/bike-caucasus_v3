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
    if (
      (key === 'timeDetailsInMilliseconds' ||
        key === 'id' ||
        key === 'startNumber' ||
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