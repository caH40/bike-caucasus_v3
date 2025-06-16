import { create } from 'zustand';

import type { TRaceRegistrationDto } from '@/types/dto.types';

type TRegistrationRace = {
  registeredRiders: TRaceRegistrationDto[];
  // eslint-disable-next-line no-unused-vars
  setRegisteredRiders: (registeredRiders: TRaceRegistrationDto[]) => void;
};

/**
 * Стор работы при регистрации в Заезд Чемпионата.
 */
export const useRegistrationRace = create<TRegistrationRace>((set) => ({
  // Зарегистрированные райдеры.
  registeredRiders: [],

  // Установка зарегистрированных райдеров.
  // Обновление массива свободных номеров для регистрации.
  setRegisteredRiders: (registeredRiders) => {
    // Установка новых зарегистрированных райдеров
    set({ registeredRiders });
  },
}));
