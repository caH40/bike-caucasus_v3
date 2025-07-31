import { useMemo } from 'react';
import { TrackData } from '@/types/index.interface';

/**
 * Хук для создания маршрута по треку с учетом количества кругов (laps).
 *
 * @param trackData - Исходные данные трека
 * @param laps - Количество кругов
 * @returns Новый трек с повторяющимися позициями или null
 */
export function useTrackDataWithLaps(
  trackData: TrackData | null,
  laps: number
): TrackData | null {
  return useMemo(() => {
    if (!trackData || laps <= 0 || trackData.positions.length === 0) {
      return null;
    }

    const repeatedPositions = Array(laps).fill(trackData.positions).flat();

    return {
      metadata: trackData.metadata,
      positions: repeatedPositions,
    };
  }, [trackData, laps]);
}
