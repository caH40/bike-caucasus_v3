import { create } from 'zustand';

type TRaceProtocolStore = {
  raceNumber: number;
  // eslint-disable-next-line no-unused-vars
  setRaceNumber: (raceNumber: number) => void;
};

/**
 * Стор работы при создании протокола Заезда Чемпионата.
 */
export const useRaceProtocol = create<TRaceProtocolStore>((set, get) => ({
  // Триггер для запроса зарегистрированных райдеров в useEffect.
  raceNumber: 1,
  setRaceNumber: (raceNumber) => set(() => ({ raceNumber })),
}));
