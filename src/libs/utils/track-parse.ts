import { getGPSData } from '@/actions/gpx';

// types
import { LatLng, MetadataParsed, TrackData } from '@/types/index.interface';

/**
 * Получение данных трека по url в формате trackData.
 * isDetailed:true происходит интерполяция дополнительных точек на треке через равные интервалы для отображения плавных изменений профиля высоты трека.
 */

export async function parseGPXTrack(url: string, isDetailed?: boolean): Promise<TrackData> {
  const data = await getGPSData(url, isDetailed);

  const positionsParsed: (LatLng & { ele: number })[] = data.gpx.trk[0].trkseg[0].trkpt.map(
    (point) => ({
      lat: parseFloat(point.$.lat),
      lng: parseFloat(point.$.lon),
      ele: parseFloat(point.ele[0]), // Добавляем ele для высоты
    })
  );

  const metadataParsed: MetadataParsed = {
    name: data.gpx.metadata[0].name ? data.gpx.metadata[0].name[0] : null,
    time: data.gpx.metadata[0].time ? new Date(data.gpx.metadata[0].time[0]) : null,
    link: data.gpx.metadata[0].link
      ? {
          href: data.gpx.metadata[0].link[0].$.href,
          text: data.gpx.metadata[0].link[0].text[0],
        }
      : null,
  };

  return { positions: positionsParsed, metadata: metadataParsed };
}
