import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import type { TRaceRegistrationDto } from '@/types/dto.types';
import type { TFormResultRace } from '@/types/index.interface';

type Props = {
  startNumberRegisteredInRace: number;
  registeredRiders: TRaceRegistrationDto[];
  lastNameRegisteredInRace: string;
  setValue: UseFormSetValue<TFormResultRace>;
};

type TSetValue = {
  selectedRider: TRaceRegistrationDto;
  setValue: UseFormSetValue<TFormResultRace>;
};

/**
 * Синхронизация данных startNumber и fullName при их изменениях.
 */
export function useAddResultRace({
  startNumberRegisteredInRace,
  registeredRiders,
  lastNameRegisteredInRace,
  setValue,
}: Props) {
  useEffect(() => {
    if (startNumberRegisteredInRace !== 0) {
      const selectedRider = registeredRiders.find(
        (elm) => elm.startNumber === +startNumberRegisteredInRace
      );

      if (selectedRider) {
        setValue('riderRegisteredInRace.lastName', selectedRider.rider.lastName);

        // Заполнение полей в соответствии с выбранным стартовым номером зарегистрировавшегося райдера.
        setValueFields({ setValue, selectedRider });
      }
    }
  }, [startNumberRegisteredInRace, registeredRiders, setValue]);

  useEffect(() => {
    if (lastNameRegisteredInRace !== '') {
      const selectedRider = registeredRiders.find(
        (elm) => elm.rider.lastName === lastNameRegisteredInRace
      );

      if (selectedRider?.startNumber) {
        setValue('riderRegisteredInRace.startNumber', selectedRider.startNumber);

        // Заполнение полей в соответствии с выбранным стартовым номером зарегистрировавшегося райдера.
        setValueFields({ setValue, selectedRider });
      }
    }
  }, [lastNameRegisteredInRace, registeredRiders, setValue]);

  return {};
}

/**
 * Заполнение полей в соответствии с выбранным стартовым номером или фамилией зарегистрировавшегося райдера.
 */
function setValueFields({ setValue, selectedRider }: TSetValue) {
  setValue('rider.lastName', selectedRider.rider.lastName);
  setValue('rider.firstName', selectedRider.rider.firstName);
  setValue('rider.patronymic', selectedRider.rider.patronymic || '');
  setValue('rider.gender', selectedRider.rider.gender);
  setValue('rider.yearBirthday', selectedRider.rider.yearBirthday);
  setValue('rider.city', selectedRider.rider.city);
  setValue('rider.team', selectedRider.rider.team);
  setValue('rider.id', selectedRider.rider.id);

  // Обнуление полей финишного времени.
  setValue('time.hours', '');
  setValue('time.minutes', '');
  setValue('time.seconds', '');
  setValue('time.milliseconds', '');
}
