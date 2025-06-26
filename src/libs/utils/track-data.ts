import { LatLng, TrackData, TrackStats } from '@/types/index.interface';

/**
 * Перевод градусов в радианы.
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Вычисление расстояния между двумя координатами с учётом кривизны Земли (формула гаверсинусов).
 */
function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6371000; // Радиус Земли в метрах
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Расчёт метрик по GPS-треку: расстояние, набор высоты, градиент и др.
 */
export function getTrackStatsFromTrackData(trackData: TrackData): TrackStats {
  const positions = trackData.positions;

  let distanceInMeter = 0;
  let ascentInMeter = 0;
  let lowestElev = Infinity;
  let highestElev = -Infinity;

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];

    // Суммируем расстояние между точками
    const segmentDist = haversineDistance(prev, curr);
    distanceInMeter += segmentDist;

    // Учитываем только положительные изменения высоты
    const elevationDiff = curr.ele - prev.ele;
    if (elevationDiff > 0) {
      ascentInMeter += elevationDiff;
    }

    // Находим экстремальные значения высоты
    if (curr.ele < lowestElev) {
      lowestElev = curr.ele;
    }
    if (curr.ele > highestElev) {
      highestElev = curr.ele;
    }
  }

  const avgGrade = distanceInMeter > 0 ? (ascentInMeter / distanceInMeter) * 100 : 0;

  return {
    distanceInMeter: Math.round(distanceInMeter),
    ascentInMeter: Math.round(ascentInMeter),
    avgGrade: Number(avgGrade.toFixed(2)),
    lowestElev: Math.round(lowestElev),
    highestElev: Math.round(highestElev),
  };
}
