import { create } from 'zustand';

type TMobileMenu = {
  isMenuOpen: boolean;
  setMobileMenu: (value: boolean) => void; // eslint-disable-line
};

/**
 * Создает хранилище состояния для отслеживания мобильного меню.
 */
export const useMobileMenuStore = create<TMobileMenu>((set) => ({
  isMenuOpen: false, // Флаг, указывающий, открыто ли мобильное меню.
  setMobileMenu: (value) => set({ isMenuOpen: value }), // Функция для установки состояния открытия/закрытия мобильного меню
}));
