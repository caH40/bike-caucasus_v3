import { TRaceRegistrationDto } from '@/types/dto.types';
import { create } from 'zustand';

type TRegistrationRace = {
  startNumbersFree: number[];
  // eslint-disable-next-line no-unused-vars
  setStartNumbersFree: (startNumbersOccupied: number[]) => void;
  registeredRiders: TRaceRegistrationDto[];
  // eslint-disable-next-line no-unused-vars
  setRegisteredRiders: (registeredRiders: TRaceRegistrationDto[]) => void;
};

/**
 * Стор работы при регистрации в Заезд Чемпионата.
 */
export const registrationRace = create<TRegistrationRace>((set, get) => ({
  startNumbersFree: Array(50)
    .fill('_')
    .map((_, index) => index + 1),

  /**
   * Возвращает массив свободных стартовых номеров, для выбора их райдерами при регистрации на Заезд.
   * @param startNumbersOccupied массив занятых стартовых номеров.
   */
  setStartNumbersFree: (startNumbersOccupied) => {
    set((state) => {
      const startNumbersFree: number[] = state.startNumbersFree.filter(
        (elm) => !startNumbersOccupied.includes(elm)
      );
      return { startNumbersFree };
    });
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
    get().setStartNumbersFree(startNumbersOccupied);

    // Установка новых зарегистрированных райдеров
    set({ registeredRiders });
  },
}));
