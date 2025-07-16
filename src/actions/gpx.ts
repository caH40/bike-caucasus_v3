'use server';

import { interpolatePoints } from '@/libs/utils/interpolatePoints';
import { parseGPX } from '@/libs/utils/parse-gpx';
import type { GPX } from '@/types/index.interface';

/**
 * Серверный экшен получения GPX с опциональной интерполяцией точек.
 * @param url - Ссылка на GPX файл.
 * @param isDetailed - true = добавляем дополнительные точки.
 */
export async function getGPSData(url: string, isDetailed?: boolean): Promise<GPX> {
  const data = await parseGPX(url);

  if (!isDetailed) {
    return data;
  }

  const originalTrack = data.gpx.trk[0];
  const originalSegment = originalTrack.trkseg[0];
  const originalPoints = originalSegment.trkpt;

  const detailedPoints = interpolatePoints(originalPoints);

  const detailedTrack = {
    ...originalTrack,
    trkseg: [{ trkpt: detailedPoints }],
  };

  return {
    ...data,
    gpx: {
      ...data.gpx,
      trk: [{ ...detailedTrack }],
    },
  };
}
