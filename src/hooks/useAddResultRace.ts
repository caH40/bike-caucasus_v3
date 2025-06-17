import { Dispatch, SetStateAction, useEffect } from 'react';
import { UseFormReset, UseFormSetValue } from 'react-hook-form';

import type { TRaceRegistrationDto } from '@/types/dto.types';
import type { TFormResultRace, TOptions } from '@/types/index.interface';
import { DEFAULT_AGE_NAME_CATEGORY } from '@/constants/category';
import { addStartNumberOption } from '@/libs/utils/championship/registration';

type Props = {
  startNumberRegisteredInRace: number;
  registeredRiders: TRaceRegistrationDto[];
  lastNameRegisteredInRace: string;
  setValue: UseFormSetValue<TFormResultRace>;
  reset: UseFormReset<TFormResultRace>;
  categorySkillLevelNames: string[]; // Названия skillLevel категорий для заезда.
  setStartNumbersOptions: Dispatch<SetStateAction<TOptions[]>>;
};

type TSetValue = {
  selectedRider: TRaceRegistrationDto;
  setValue: UseFormSetValue<TFormResultRace>;
  categorySkillLevelNames: string[]; // Названия skillLevel категорий для заезда.
};

/**
 * Синхронизация данных startNumber и fullName при их изменениях.
 */
export function useAddResultRace({
  startNumberRegisteredInRace,
  registeredRiders,
  lastNameRegisteredInRace,
  setValue,
  categorySkillLevelNames,
  reset,
  setStartNumbersOptions,
}: Props) {
  useEffect(() => {
    if (startNumberRegisteredInRace && startNumberRegisteredInRace !== 0) {
      const selectedRider = registeredRiders.find(
        (elm) => elm.startNumber === +startNumberRegisteredInRace
      );

      if (selectedRider) {
        setValue('riderRegisteredInRace.lastName', selectedRider.rider.lastName);
        setValue('newStartNumber', startNumberRegisteredInRace);

        // Добавление стартового номера участника, который был зарегистрирован и имел стартовый номер.
        // Делается для отображения соответствующего номера в списке options поля выбора стартового номера.
        setStartNumbersOptions((prev) =>
          addStartNumberOption(prev, startNumberRegisteredInRace)
        );

        // Заполнение полей в соответствии с выбранным стартовым номером зарегистрировавшегося райдера.
        setValueFields({ setValue, selectedRider, categorySkillLevelNames });
      }
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startNumberRegisteredInRace, registeredRiders, setValue, reset]);

  useEffect(() => {
    if (lastNameRegisteredInRace !== '') {
      const selectedRider = registeredRiders.find(
        (elm) => elm.rider.lastName === lastNameRegisteredInRace
      );

      const startNumber = selectedRider?.startNumber;

      if (startNumber) {
        setValue('riderRegisteredInRace.startNumber', startNumber);
        setValue('newStartNumber', startNumber);

        // Добавление стартового номера участника, который был зарегистрирован и имел стартовый номер.
        // Делается для отображения соответствующего номера в списке options поля выбора стартового номера.
        setStartNumbersOptions((prev) => addStartNumberOption(prev, startNumber));

        // Заполнение полей в соответствии с выбранным стартовым номером зарегистрировавшегося райдера.
        setValueFields({ setValue, selectedRider, categorySkillLevelNames });
      }
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastNameRegisteredInRace, registeredRiders, setValue, reset]);

  return {};
}

/**
 * Заполнение полей в соответствии с выбранным стартовым номером или фамилией зарегистрировавшегося райдера.
 */
function setValueFields({ setValue, selectedRider, categorySkillLevelNames }: TSetValue) {
  setValue('rider.lastName', selectedRider.rider.lastName);
  setValue('rider.firstName', selectedRider.rider.firstName);
  setValue('rider.patronymic', selectedRider.rider.patronymic || '');
  setValue('rider.gender', selectedRider.rider.gender);
  setValue('rider.yearBirthday', selectedRider.rider.yearBirthday);
  setValue('rider.city', selectedRider.rider.city);
  setValue('rider.team', selectedRider.rider.team);
  setValue('rider.id', selectedRider.rider.id);
  setValue('rider._id', selectedRider.rider._id);

  setValue(
    'categoryName',
    categorySkillLevelNames.includes(selectedRider.category)
      ? selectedRider.category
      : DEFAULT_AGE_NAME_CATEGORY
  );

  // Обнуление полей финишного времени.
  setValue('time.hours', '');
  setValue('time.minutes', '');
  setValue('time.seconds', '');
  setValue('time.milliseconds', '');
}
