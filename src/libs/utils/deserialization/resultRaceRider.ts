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
      (key === 'riderFromDB' || key === 'riderManual' || key === 'riderRegistered') &&
      typeof value === 'string'
    ) {
      resultRaceRider[key] = JSON.parse(value);
      continue;
    }

    if (key === 'timeDetailsInMilliseconds' && typeof value === 'string') {
      resultRaceRider[key] = +value;
    }
  }

  return resultRaceRider;
}
