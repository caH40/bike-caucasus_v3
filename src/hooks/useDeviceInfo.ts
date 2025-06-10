import { useEffect, useState } from 'react';

import { TDeviceInfo } from '@/types/index.interface';

/**
 * Хук для получения информации об устройстве пользователя.
 */
export function useDeviceInfo(): TDeviceInfo {
  // Состояние для хранения информации об устройстве.
  const [deviceInfo, setDeviceInfo] = useState<TDeviceInfo>({
    userAgent: null,
    language: null,
    screenResolution: null,
  });

  useEffect(() => {
    // Обновление информации об устройстве один раз при монтировании компонента
    setDeviceInfo({
      userAgent: navigator.userAgent, // Информация о браузере и ОС/
      language: navigator.language, // Язык браузера/
      screenResolution: `${window.screen.width}x${window.screen.height}`, // Разрешение экрана/
    });
  }, []); // Пустой массив зависимостей, хук сработает только один раз

  return deviceInfo;
}
