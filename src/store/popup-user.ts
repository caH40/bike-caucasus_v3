import { create } from 'zustand';

type PopupUserStore = {
  isVisible: boolean;
  setMenu: (value: boolean) => void; // eslint-disable-line
};

/**
 * Хранилище для модального информационного окна.
 */
export const usePopupUserStore = create<PopupUserStore>((set) => ({
  isVisible: false,
  setMenu: (value) => set({ isVisible: value }),
}));
