import { create } from 'zustand';

// Определяем интерфейс для хранилища состояния загрузки
type TPermission = {
  permissions: string[];
  addPermission: (name: string) => void; // eslint-disable-line
  removePermission: (name: string) => void; // eslint-disable-line
  resetPermissions: () => void; // eslint-disable-line
};

/**
 * Хранилище для формы Ролей и Разрешений.
 */
export const usePermissionTable = create<TPermission>((set) => ({
  permissions: [],
  addPermission: (name) => {
    set((state) => ({
      permissions: state.permissions.includes(name)
        ? state.permissions
        : [...state.permissions, name],
    }));
  },
  removePermission: (name) => {
    set((state) => ({
      permissions: state.permissions.filter((elm) => elm !== name),
    }));
  },
  resetPermissions: () => set({ permissions: [] }),
}));
