import { TFormRaceRegistration, TRaceForForm } from '@/types/index.interface';

export function getDefaultValue(
  value: string | null,
  type: 'city' | 'firstName' | 'lastName' | 'gender' | 'ageCategory'
): string {
  switch (type) {
    case 'firstName':
      return value || 'Нет данных по имени, пожалуйста заполните данные в аккаунте!';

    case 'lastName':
      return value || 'Нет данных по фамилии, пожалуйста заполните данные в аккаунте!';

    case 'city':
      return value || 'Нет данных по городу, пожалуйста заполните данные в аккаунте!';

    case 'gender':
      return value === 'male' ? 'мужской' : 'женский';

    case 'ageCategory':
      return value || 'Нет данных по возрасту, пожалуйста заполните данные в аккаунте!';

    default:
      return 'нет данных';
  }
}

/**
 * Проверка заполнения обязательных полей формы.
 */
export function validateRequiredFields(
  value: string | undefined,
  type: 'city' | 'firstName' | 'lastName' | 'gender' | 'ageCategory'
): { ok: boolean; message: string } {
  switch (type) {
    case 'firstName':
      return value
        ? { ok: true, message: 'ok' }
        : {
            ok: false,
            message: 'Нет данных по имени, пожалуйста заполните данные в аккаунте!',
          };

    case 'lastName':
      return value
        ? { ok: true, message: 'ok' }
        : {
            ok: false,
            message: 'Нет данных по фамилии, пожалуйста заполните данные в аккаунте!',
          };

    case 'city':
      return value
        ? { ok: true, message: 'ok' }
        : {
            ok: false,
            message: 'Нет данных по городу, пожалуйста заполните данные в аккаунте!',
          };

    case 'gender':
      return value
        ? { ok: true, message: 'ok' }
        : {
            ok: false,
            message: 'Нет данных по полу, пожалуйста заполните данные в аккаунте!',
          };

    case 'ageCategory':
      return value
        ? { ok: true, message: 'ok' }
        : {
            ok: false,
            message: 'Нет данных по возрасту, пожалуйста заполните данные в аккаунте!',
          };

    default:
      return { ok: false, message: 'не распознан тип проверочных данных' };
  }
}

export function initRegChampForm(races: TRaceForForm[]): TFormRaceRegistration {
  const raceId = races.sort((a, b) => a.number - b.number)[0]._id;

  return { raceId, teamVariable: '', startNumber: 1 };
}
