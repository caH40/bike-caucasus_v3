import { TFormResultRace } from '@/types/index.interface';

type Params = {
  dataFromForm: Omit<TFormResultRace, 'time'>;
  timeDetailsInMilliseconds: number;
};

/**
 * Сериализация данных результата райдера в Заезде Чемпионата.
 */
export function serializationResultRaceRider({
  dataFromForm,
  timeDetailsInMilliseconds,
}: Params): FormData {
  const formData = new FormData();

  if (dataFromForm.riderFromDB) {
    formData.set('riderFromDB', JSON.stringify(dataFromForm.riderFromDB));
  }

  if (dataFromForm.riderManual) {
    formData.set('riderManual', JSON.stringify(dataFromForm.riderManual));
  }

  if (dataFromForm.riderRegistered) {
    formData.set('riderRegistered', JSON.stringify(dataFromForm.riderRegistered));
  }

  formData.set('timeDetailsInMilliseconds', String(timeDetailsInMilliseconds));
  return formData;
}
