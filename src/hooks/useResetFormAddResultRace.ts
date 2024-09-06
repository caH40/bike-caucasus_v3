import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { TFormResultRace } from '@/types/index.interface';

type Params = {
  setValue: UseFormSetValue<TFormResultRace>;
  activeIdBtn: number;
};

/**
 * Хук для сброса полей формы добавления результата гонки при переключении фильтра выбора типа ввода данных.
 *
 * @param {UseFormSetValue<TFormResultRace>} setValue - Функция для установки значений полей формы.
 * @param {number} activeIdBtn - Идентификатор активной кнопки, при изменении которого происходит сброс формы.
 */
export function useResetFormAddResultRace({ setValue, activeIdBtn }: Params) {
  useEffect(() => {
    // Объект для хранения всех полей формы и их значений по умолчанию.
    const defaultValues: Partial<TFormResultRace> = {
      riderRegisteredInRace: {
        lastName: '',
        startNumber: 0,
      },
      riderRegisteredSite: {
        id: 0,
        lastName: '',
      },
      rider: {
        _id: '',
        lastName: '',
        firstName: '',
        patronymic: '',
        city: '',
        gender: 'male',
        id: 0,
        team: '',
        yearBirthday: '',
        fractionalYears: 0,
        fullYears: 0,
      },
      time: {
        hours: '',
        milliseconds: '',
        minutes: '',
        seconds: '',
      },
      newStartNumber: 0,
    };

    // Сброс всех полей с помощью одного цикла.
    Object.entries(defaultValues).forEach(([key, value]) => {
      setValue(key as keyof TFormResultRace, value);
    });
  }, [activeIdBtn, setValue]);
}
