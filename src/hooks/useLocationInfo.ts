import { useState, useEffect } from 'react';

import { TLocationInfo } from '@/types/index.interface';

/**
 * Хук для получения информации о местоположении пользователя.
 *
 * Сначала пытается получить данные с помощью API по IP адресу (ipinfo.io).
 * Возвращает объект с информацией о местоположении, включая:
 * - IP-адрес.
 * - Город.
 * - Регион.
 * - Страну.
 * - Часовой пояс.
 */
export function useLocationInfo(): TLocationInfo {
  // Состояние для хранения данных о местоположении.
  const [location, setLocation] = useState<TLocationInfo>({
    ip: null, // IP-адрес пользователя.
    city: null, // Город.
    region: null, // Регион.
    country: null, // Страна.
    timezone: null, // Часовой пояс.
  });

  useEffect(() => {
    // Запрос к API ipinfo.io для получения данных по IP-адресу.
    fetch('https://ipinfo.io/json')
      .then((response) => response.json()) // Преобразуем ответ в JSON.
      .then((data) => {
        // Обновляем состояние с полученными данными.
        setLocation({
          ip: data.ip, // IP-адрес.
          city: data.city, // Город.
          region: data.region, // Регион.
          country: data.country, // Страна.
          timezone: data.timezone, // Часовой пояс.
        });
      })
      .catch((error) => {
        // Обработка ошибок, если API запрос не удается.
        // eslint-disable-next-line no-console
        console.error('Ошибка при получении данных о местоположении:', error);
      });
  }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании компонента.

  // Возвращаем данные о местоположении.
  return location;
}
