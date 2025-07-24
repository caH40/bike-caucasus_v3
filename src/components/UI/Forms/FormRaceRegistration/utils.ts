import { TFormRaceRegistration, TRaceForForm } from '@/types/index.interface';

/**
 * Проверка заполнения обязательных полей формы.
 */
export function validateRequiredFields(
  value: string | undefined,
  type:
    | 'city'
    | 'firstName'
    | 'lastName'
    | 'gender'
    | 'ageCategory'
    | 'patronymic'
    | 'yearBirthday'
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

    // Остальные значения необязательные.
    default:
      return { ok: true, message: 'ok' };
  }
}

export function initRegChampForm(races: TRaceForForm[]): TFormRaceRegistration {
  const raceId = races.sort((a, b) => a.number - b.number)[0]._id;

  return { raceId, teamVariable: '', startNumber: 1, categoryName: 'Возрастная' };
}
