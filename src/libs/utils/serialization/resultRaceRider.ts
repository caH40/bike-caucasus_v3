import { TDataFromFormResultRace } from '@/types/index.interface';

/**
 * Сериализация данных результата райдера в Заезде Чемпионата.
 */
export function serializationResultRaceRider(dataFromForm: TDataFromFormResultRace): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(dataFromForm)) {
    if (value) {
      formData.set(key, String(value));
    }
  }

  return formData;
}
