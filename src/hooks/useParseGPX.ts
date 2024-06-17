import { getGPSData } from '@/actions/gpx';
import { useEffect, useState } from 'react';

export interface LatLng {
  lat: number;
  lng: number;
  ele?: number; // Добавляем ele для высоты
}

export function useParseGPX(url: string) {
  const [trackData, setTrackData] = useState<{
    positions: LatLng[];
    metadata: MetadataParsed;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getGPSData(url);

        const positionsParsed: LatLng[] = data.gpx.trk[0].trkseg[0].trkpt.map((point) => ({
          lat: parseFloat(point.$.lat),
          lng: parseFloat(point.$.lon),
          ele: parseFloat(point.ele[0]), // Добавляем ele для высоты
        }));

        const metadataParsed: MetadataParsed = {
          name: data.gpx.metadata[0].name[0],
          time: data.gpx.metadata[0].time ? new Date(data.gpx.metadata[0].time[0]) : null,
          link: data.gpx.metadata[0].link
            ? {
                href: data.gpx.metadata[0].link[0].$.href,
                text: data.gpx.metadata[0].link[0].text[0],
              }
            : null,
        };
        setTrackData({ positions: positionsParsed, metadata: metadataParsed });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Ошибка при загрузке или парсинге GPX файла:', error);
      }
    }

    fetchData();
  }, [url]);

  return trackData;
}

type MetadataParsed = {
  name: string; // Название трэка.
  time: Date | null; // Дата создания трэка.
  link: {
    href: string; // Сервис, на котором создан трэк.
    text: string; // Название сервиса, на котором создан трэк.
  } | null;
};
