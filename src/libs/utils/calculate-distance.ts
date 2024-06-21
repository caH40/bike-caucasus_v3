/**
 * Рассчитывает расстояние между двумя точками с заданными координатами.
 *
 * @param {number} lat1 - Широта первой точки.
 * @param {number} lon1 - Долгота первой точки.
 * @param {number} lat2 - Широта второй точки.
 * @param {number} lon2 - Долгота второй точки.
 * @returns {number} Расстояние между точками в метрах.
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  // Преобразует значение из градусов в радианы.
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Радиус Земли в км.
  const dLat = toRad(lat2 - lat1); // Разница широт в радианах.
  const dLon = toRad(lon1 - lon2); // Разница долгот в радианах.

  // Формула Гаверсина для вычисления расстояния между двумя точками на сфере по их координатам.
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Расстояние в км.
  return d * 1000; // Расстояние в метрах.
};
