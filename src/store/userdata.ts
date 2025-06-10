import { TDeviceInfo, TLocationInfo } from '@/types/index.interface';
import { create } from 'zustand';

export type TStoredUserData = {
  location: TLocationInfo;
  deviceInfo: TDeviceInfo;
  setLocation: (location: TLocationInfo) => void;
  setDevice: (device: TDeviceInfo) => void;
};

/**
 * Хранилище данных клиентских данных location и deviceInfo.
 */
export const useUserData = create<TStoredUserData>((set) => ({
  location: {
    ip: null,
    city: null,
    region: null,
    country: null,
    timezone: null,
  },
  deviceInfo: {
    userAgent: null,
    language: null,
    screenResolution: null,
  },
  setLocation: (location: TLocationInfo) => set({ location }),
  setDevice: (deviceInfo: TDeviceInfo) => set({ deviceInfo }),
}));
