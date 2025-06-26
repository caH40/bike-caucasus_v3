import { useEffect, useState } from 'react';

import type { TrackData } from '@/types/index.interface';
import { parseGPXTrack } from '@/libs/utils/track-parse';

export function useParseGPX(url: string) {
  const [trackData, setTrackData] = useState<TrackData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const parsedData = await parseGPXTrack(url);
        setTrackData(parsedData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Ошибка при загрузке или парсинге GPX файла:', error);
      }
    }

    fetchData();
  }, [url]);

  return trackData;
}
