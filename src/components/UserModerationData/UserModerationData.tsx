'use client';

import { useEffect } from 'react';

import { useDeviceInfo } from '@/hooks/useDeviceInfo';
import { useLocationInfo } from '@/hooks/useLocationInfo';
import { useUserData } from '@/store/userdata';

/**
 * Сбор location и deviceInfo пользователя и сохранение данных в хранилище.
 */
export default function UserModerationData() {
  const location = useLocationInfo();
  const deviceInfo = useDeviceInfo();

  const { setLocation, setDevice } = useUserData();

  useEffect(() => {
    if (location?.ip) {
      setLocation(location);
    }
  }, [location, setLocation]);

  useEffect(() => {
    if (deviceInfo?.userAgent) {
      setDevice(deviceInfo);
    }
  }, [deviceInfo, setDevice]);

  return null;
}
