/**
 * Хранилище для модального информационного окна.
 */

import { create } from 'zustand';

type ModalStore = {
  isActive: boolean;
  title: string | null;
  body: React.ReactNode | null;
  setModal: (title: string, body: React.ReactNode) => void; // eslint-disable-line
  resetModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isActive: false,
  title: '',
  body: '',
  setModal: (title, body) => set({ body, title, isActive: true }),
  resetModal: () => set({ body: null, isActive: false, title: null }),
}));
