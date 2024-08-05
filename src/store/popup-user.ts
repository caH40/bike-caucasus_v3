import { create } from 'zustand';

type PopupUserStore = {
  isVisible: boolean;
  setMenu: (value: boolean) => void; // eslint-disable-line
};

/**
 * Хранилище попап меню Пользователя, сделано в Сторе так как управление происходит из разных компонентов.
 */
export const usePopupUserStore = create<PopupUserStore>((set) => ({
  isVisible: false,
  setMenu: (value) => set({ isVisible: value }),
}));
