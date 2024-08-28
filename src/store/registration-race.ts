import { create } from 'zustand';

import { createOptionsStartNumbers } from '@/app/championships/registration/[urlSlug]/utils';
import type { TRaceRegistrationDto } from '@/types/dto.types';
import type { TOptions } from '@/types/index.interface';

type TRegistrationRace = {
  trigger: boolean;
  toggleTrigger: () => void;
  registeredRiders: TRaceRegistrationDto[];
  // eslint-disable-next-line no-unused-vars
  setRegisteredRiders: (registeredRiders: TRaceRegistrationDto[]) => void;
  // eslint-disable-next-line no-unused-vars
  selectOptions: TOptions[];
  // eslint-disable-next-line no-unused-vars
  setSelectOptions: (startNumbersOccupied: (number | undefined)[]) => void;
  startNumberFree: number | undefined;
};

const numbersTotal = 30;
// Инициализация массива свободных стартовых номеров.
const initStartNumbersFree = Array(numbersTotal)
  .fill('_')
  .map((_, index) => index + 1);

/**
 * Стор работы при регистрации в Заезд Чемпионата.
 */
export const useRegistrationRace = create<TRegistrationRace>((set, get) => ({
  // Триггер для запроса зарегистрированных райдеров в useEffect.
  trigger: false,
  toggleTrigger: () => {
    set((state) => ({ trigger: !state.trigger }));
  },

  selectOptions: createOptionsStartNumbers(initStartNumbersFree),

  // Свободный стартовый номер для инициализации Select. Так как формирование массива options
  // происходит не при монтировании компонента, а после получение данных выбранного Заезда в другом Select.
  startNumberFree: 1,

  // Создание массива option для select выбора свободно стартового номера при регистрации на Заезд.
  setSelectOptions: (startNumbersOccupied) => {
    const startNumbersFree: number[] = initStartNumbersFree.filter(
      (elm) => !startNumbersOccupied.includes(elm)
    );
    set(() => ({
      selectOptions: createOptionsStartNumbers(startNumbersFree),
      startNumberFree: startNumbersFree[0],
    }));
  },

  // Зарегистрированные райдеры.
  registeredRiders: [],

  // Установка зарегистрированных райдеров.
  // Обновление массива свободных номеров для регистрации.
  setRegisteredRiders: (registeredRiders) => {
    const startNumbersOccupied = registeredRiders.map(
      (registeredRide) => registeredRide.startNumber
    );

    // Вызов метода для обновления списка свободных номеров.
    get().setSelectOptions(startNumbersOccupied);

    // Установка новых зарегистрированных райдеров
    set({ registeredRiders });
  },
}));
