/**
 * Сериализация данных результата райдера в Заезде Чемпионата.
 */
export function serializationResultRaceRider<T extends Record<string, unknown>>(
  dataFromForm: T
): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(dataFromForm)) {
    if (key === 'disqualification' && value) {
      formData.set(key, JSON.stringify(value));

      continue;
    }
    if (value || value === null) {
      formData.set(key, String(value));
    }
  }

  return formData;
}
