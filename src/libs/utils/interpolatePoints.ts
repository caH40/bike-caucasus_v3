import type { GpxTrackPoint } from '@/types/index.interface';
import * as turf from '@turf/turf';

const INTERVAL = 25; // Точка через каждые 25 метров.
/**
 * Добавляет интерполированные точки между каждой парой точек.
 * Интервал — каждые ~25 метров.
 */
export function interpolatePoints(
  points: GpxTrackPoint[],
  interval = INTERVAL
): GpxTrackPoint[] {
  const coordinates = points
    .map((pt) => {
      const lon = parseFloat(pt.$.lon);
      const lat = parseFloat(pt.$.lat);
      const ele = parseFloat(pt.ele?.[0] ?? '0');

      if (isNaN(lon) || isNaN(lat)) {
        // eslint-disable-next-line no-console
        console.warn('Пропущена точка с некорректными координатами', pt);
        return null;
      }

      return [lon, lat, ele] as [number, number, number];
    })
    .filter((c): c is [number, number, number] => c !== null);

  if (coordinates.length < 2) {
    throw new Error('Недостаточно валидных точек для интерполяции');
  }

  const line = turf.lineString(
    coordinates.map(([lon, lat]) => [lon, lat]),
    {}
  );

  const length = turf.length(line, { units: 'kilometers' });
  const numPoints = Math.floor((length * 1000) / interval);

  const interpolated: GpxTrackPoint[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const dist = (i * interval) / 1000;
    const point = turf.along(line, dist, { units: 'kilometers' });

    const [lon, lat] = point.geometry.coordinates;

    if (typeof lon !== 'number' || typeof lat !== 'number' || isNaN(lon) || isNaN(lat)) {
      // eslint-disable-next-line no-console
      console.error('Некорректные координаты для интерполяции:', lon, lat);
      continue;
    }

    const { index, ratio } = findClosestSegment(coordinates, [lon, lat]);
    const prev = coordinates[index];
    const next = coordinates[index + 1] || prev;
    const ele = prev[2] + (next[2] - prev[2]) * ratio;

    interpolated.push({
      $: {
        lat: lat.toFixed(7),
        lon: lon.toFixed(7),
      },
      ele: [ele.toFixed(1)],
      time: [''],
    });
  }

  return interpolated;
}

/**
 * Находит ближайший отрезок (сегмент) в массиве координат к заданной точке
 * и вычисляет относительное положение (ratio) проекции точки на этом отрезке.
 *
 * @param coords - Массив координат в формате [долгота, широта, высота].
 * @param target - Целевая точка [долгота, широта], которую нужно проецировать на линию.
 * @returns {{ index: number, ratio: number }}
 *   `index` — индекс первой точки ближайшего сегмента,
 *   `ratio` — значение от 0 до 1, указывающее положение проекции на этом сегменте:
 *             0 — в начале (p1), 1 — в конце (p2), между — внутри сегмента.
 */
function findClosestSegment(
  coords: [number, number, number][],
  target: [number, number]
): { index: number; ratio: number } {
  let closestIndex = 0;
  let closestRatio = 0;
  let minDistance = Infinity;

  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = coords[i];
    const p2 = coords[i + 1];

    // Пропускаем дубликаты.
    if (p1[0] === p2[0] && p1[1] === p2[1]) {
      continue;
    }

    // Векторные вычисления для проекции.
    const x = target[0],
      y = target[1];
    const x1 = p1[0],
      y1 = p1[1];
    const x2 = p2[0],
      y2 = p2[1];

    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let ratio = lenSq ? dot / lenSq : -1;
    ratio = Math.max(0, Math.min(1, ratio)); // Ограничиваем [0, 1].

    const projX = x1 + ratio * C;
    const projY = y1 + ratio * D;
    const dist = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);

    if (dist < minDistance) {
      minDistance = dist;
      closestIndex = i;
      closestRatio = ratio;
    }
  }

  return { index: closestIndex, ratio: closestRatio };
}
