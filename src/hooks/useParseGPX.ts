import { useEffect, useState } from 'react';

import type { TrackData } from '@/types/index.interface';
import { parseGPXTrack } from '@/libs/utils/track-parse';

/**
 * Хук получения данных трека по url в формате trackData.
 * isDetailed:true происходит интерполяция дополнительных точек на треке через равные интервалы для отображения плавных изменений профиля высоты трека.
 */
export function useParseGPX(url: string, isDetailed?: boolean) {
  const [trackData, setTrackData] = useState<TrackData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const parsedData = await parseGPXTrack(url, isDetailed);
        setTrackData(parsedData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Ошибка при загрузке или парсинге GPX файла:', error);
      }
    }

    fetchData();
  }, [url, isDetailed]);

  return trackData;
}
