'use client';

import 'leaflet/dist/leaflet.css';
import './style.css';
import { useRef } from 'react';
import { MapContainer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import crosshair from 'chartjs-plugin-crosshair';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  crosshair
);

import { useParseGPX } from '@/hooks/useParseGPX';
import LayerControlBtn from '../UI/LayerControlBtn/LayerControlBtn';
import { iconFinish, iconStart, iconPosition } from './icons';

import usePositionIndex from '@/hooks/usePositionIndex';
import styles from './Map.module.css';
import useElevation from '@/hooks/useElevation';
import { useTrackDataWithLaps } from '@/hooks/useDistanceWithLaps';
import { useChartAltitude } from '@/hooks/useChartAltitude';

type Props = {
  url: string;
  laps: number;
};

/**
 * Компонент для отображения карты с профилем высоты.
 * @param {Props} props - Свойства компонента.
 * @returns JSX.Element
 */
export default function MapWithElevation({ url, laps }: Props) {
  const refChartLine = useRef<ChartJS<'line'>>(null);
  const trackData = useParseGPX(url, true);

  // Формирование точек трека в зависимости от количества кругов в заезде.
  const trackDataWithLaps = useTrackDataWithLaps(trackData, laps);

  // Пользовательский хук для вычисления данных высоты на основе данных трека.
  const elevationData = useElevation({ trackData: trackDataWithLaps });

  // Данные для построения Диаграммы профиля высоты маршрута.
  const { chartData, chartOptions } = useChartAltitude(elevationData);

  const positionIndex = usePositionIndex({ refChartLine, elevationData });

  if (!trackDataWithLaps || trackDataWithLaps.positions.length === 0) {
    return <div>Loading...</div>;
  }

  const start = L.latLng(
    trackDataWithLaps.positions[0].lat,
    trackDataWithLaps.positions[0].lng
  );
  const bounds = trackDataWithLaps.positions.reduce((acc, cur) => {
    return acc.extend([cur.lat, cur.lng]);
  }, L.latLngBounds(start, start));

  return (
    <>
      <MapContainer bounds={bounds} scrollWheelZoom={false} className={styles.mapContainer}>
        <LayerControlBtn />

        <Polyline
          pathOptions={{ color: 'red' }}
          positions={trackDataWithLaps.positions.map((pos) => [pos.lat, pos.lng])}
        />
        <Marker
          position={[trackDataWithLaps.positions[0].lat, trackDataWithLaps.positions[0].lng]}
          icon={iconStart}
        />
        <Marker
          position={[
            trackDataWithLaps.positions.at(-1)!.lat,
            trackDataWithLaps.positions.at(-1)!.lng,
          ]}
          icon={iconFinish}
        />
        <Marker
          position={[
            trackDataWithLaps.positions[positionIndex].lat,
            trackDataWithLaps.positions[positionIndex].lng,
          ]}
          icon={iconPosition}
        />
      </MapContainer>

      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} ref={refChartLine} />
      </div>
    </>
  );
}
