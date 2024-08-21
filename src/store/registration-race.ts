import { createOptionsStartNumbers } from '@/app/championships/registration/[champName]/utils';
import { TRaceRegistrationDto } from '@/types/dto.types';
import { TOptions } from '@/types/index.interface';
import { create } from 'zustand';

type TRegistrationRace = {
  registeredRiders: TRaceRegistrationDto[];
  // eslint-disable-next-line no-unused-vars
  setRegisteredRiders: (registeredRiders: TRaceRegistrationDto[]) => void;
  // eslint-disable-next-line no-unused-vars
  selectOptions: TOptions[];
  // eslint-disable-next-line no-unused-vars
  setSelectOptions: (startNumbersOccupied: number[]) => void;
};

// Инициализация массива свободных стартовых номеров.
const initStartNumbersFree = Array(50)
  .fill('_')
  .map((_, index) => index + 1);

/**
 * Стор работы при регистрации в Заезд Чемпионата.
 */
export const useRegistrationRace = create<TRegistrationRace>((set, get) => ({
  selectOptions: createOptionsStartNumbers(initStartNumbersFree),
  /**
   * Создание массива option для select выбора свободно стартового номера при регистрации на Заезд.
   */
  setSelectOptions: (startNumbersOccupied) => {
    const startNumbersFree: number[] = initStartNumbersFree.filter(
      (elm) => !startNumbersOccupied.includes(elm)
    );
    set(() => ({ selectOptions: createOptionsStartNumbers(startNumbersFree) }));
  },

  // Зарегистрированные райдеры.
  registeredRiders: [],

  /**
   * Установка зарегистрированных райдеров.
   * Обновление массива свободных номеров для регистрации.
   */
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
