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
import { chartAltitude } from './chart';
import usePositionIndex from '@/hooks/usePositionIndex';
import styles from './Map.module.css';
import useElevation from '@/hooks/useElevation';

interface Props {
  url: string;
}

/**
 * Компонент для отображения карты с профилем высоты.
 * @param {Props} props - Свойства компонента.
 * @returns JSX.Element
 */
export default function MapWithElevation({ url }: Props) {
  const refChartLine = useRef<ChartJS<'line'>>(null);
  const trackData = useParseGPX(url);

  const elevationData = useElevation({ trackData });

  const { chartData, chartOptions } = chartAltitude(elevationData);

  const positionIndex = usePositionIndex({ refChartLine, elevationData });

  if (!trackData || trackData.positions.length === 0) {
    return <div>Loading...</div>;
  }

  const start = L.latLng(trackData.positions[0].lat, trackData.positions[0].lng);
  const bounds = trackData.positions.reduce((acc, cur) => {
    return acc.extend([cur.lat, cur.lng]);
  }, L.latLngBounds(start, start));

  return (
    <>
      <MapContainer bounds={bounds} scrollWheelZoom={false} className={styles.mapContainer}>
        <LayerControlBtn />

        <Polyline
          pathOptions={{ color: 'red' }}
          positions={trackData.positions.map((pos) => [pos.lat, pos.lng])}
        />
        <Marker
          position={[trackData.positions[0].lat, trackData.positions[0].lng]}
          icon={iconStart}
        />
        <Marker
          position={[trackData.positions.at(-1)!.lat, trackData.positions.at(-1)!.lng]}
          icon={iconFinish}
        />
        <Marker
          position={[
            trackData.positions[positionIndex].lat,
            trackData.positions[positionIndex].lng,
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
