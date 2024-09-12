/**
 * Сериализация данных результата райдера в Заезде Чемпионата.
 */
export function serializationResultRaceRider<T extends Record<string, unknown>>(
  dataFromForm: T
): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(dataFromForm)) {
    if (value) {
      formData.set(key, String(value));
    }
  }

  return formData;
}
