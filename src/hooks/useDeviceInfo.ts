import { useSyncExternalStore } from 'react';

import { TDeviceInfo } from '@/types/index.interface';

const EMPTY_DEVICE_INFO: TDeviceInfo = {
  userAgent: null,
  language: null,
  screenResolution: null,
};

// Значения не меняются за время жизни страницы — кэшируем, чтобы getSnapshot
// возвращал стабильную ссылку (иначе React зациклит рендер).
let cached: TDeviceInfo | null = null;

function getSnapshot(): TDeviceInfo {
  if (!cached) {
    cached = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };
  }

  return cached;
}

const getServerSnapshot = (): TDeviceInfo => EMPTY_DEVICE_INFO;
const subscribe = () => () => {};

/**
 * Хук для получения информации об устройстве пользователя.
 */
export function useDeviceInfo(): TDeviceInfo {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
