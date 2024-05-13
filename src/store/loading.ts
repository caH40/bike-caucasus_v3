import { create } from 'zustand';

// Определяем интерфейс для хранилища состояния загрузки
interface TLoadingStore {
  isLoading: boolean;
  setLoading: (value: boolean) => void; // eslint-disable-line
}

/**
 * Создает хранилище состояния для отслеживания загрузки.
 * @returns {TLoadingStore} Созданное хранилище состояния для загрузки.
 */
export const useLoadingStore = create<TLoadingStore>((set) => ({
  isLoading: false, // По умолчанию загрузка не активна
  setLoading: (value: boolean) => set({ isLoading: value }), // Функция для установки состояния загрузки
}));
