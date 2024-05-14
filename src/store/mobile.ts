import { create } from 'zustand';

type TMobileMenu = {
  isMenuOpen: boolean;
  setMobileMenu: () => void; // eslint-disable-line
};

/**
 * Создает хранилище состояния для отслеживания мобильного меню.
 */
export const useMobileMenuStore = create<TMobileMenu>((set) => ({
  isMenuOpen: false, // Флаг, указывающий, открыто ли мобильное меню.
  setMobileMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })), // Функция для установки состояния открытия/закрытия мобильного меню
}));
