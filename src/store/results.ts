import { create } from 'zustand';

// Определяем интерфейс для хранилища состояния загрузки
type TResultsRace = {
  triggerResultTable: boolean;
  setTriggerResultTable: () => void; // eslint-disable-line
};

export const useResultsRace = create<TResultsRace>((set) => ({
  triggerResultTable: false,
  setTriggerResultTable: () => {
    set((state) => ({ triggerResultTable: !state.triggerResultTable }));
  },
}));
