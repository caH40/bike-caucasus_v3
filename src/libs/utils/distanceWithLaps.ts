import { TrackData } from '@/types/index.interface';

/**
 * Создает маршрут по треку с учетом повторения кругов (laps).
 */
export function distanceWithLaps({
  trackData,
  laps,
}: {
  trackData: TrackData | null;
  laps: number;
}): TrackData | null {
  if (!trackData || laps <= 0) {
    return null;
  }

  const repeatedPositions = Array(laps).fill(trackData.positions).flat();

  return {
    metadata: trackData.metadata,
    positions: repeatedPositions,
  };
}
