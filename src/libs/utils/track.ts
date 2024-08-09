import { GpxTrackPoint } from '@/types/index.interface';

/**
 * Парсинг стартовых координат на треке.
 * Входящий параметр data.gpx.trk[0].trkseg[0].trkpt[0]
 */
export const getCoordStart = (startPoint: GpxTrackPoint) => {
  return {
    lat: parseFloat(startPoint.$.lat),
    lon: parseFloat(startPoint.$.lon),
  };
};
