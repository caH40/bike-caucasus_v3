import { useMemo } from 'react';

import { calculateDistance } from '@/libs/utils/calculate-distance';
import { ElevationData, TrackData } from '@/types/index.interface';

type Props = {
  trackData: TrackData | null;
};

export default function useElevation({ trackData }: Props): ElevationData[] {
  return useMemo<ElevationData[]>(() => {
    if (!trackData || trackData.positions.length === 0) {
      return [];
    }

    const data: ElevationData[] = [];
    let cumulativeDistance = 0;

    for (let i = 1; i < trackData.positions.length; i++) {
      const prev = trackData.positions[i - 1];
      const cur = trackData.positions[i];

      cumulativeDistance += calculateDistance(prev.lat, prev.lng, cur.lat, cur.lng);

      data.push({
        distance: Math.trunc(cumulativeDistance / 100) / 10,
        elevation: cur.ele || 0,
      });
    }

    return data;
  }, [trackData]);
}
