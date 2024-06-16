'use client';

import 'leaflet/dist/leaflet.css';
import './style.css';
import { useEffect, useState } from 'react';
import { MapContainer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

import { useParseGPX } from '@/hooks/useParseGPX';
import LayerControlBtn from '../UI/LayerControlBtn/LayerControlBtn';
import { iconFinish, iconStart } from './icons';
import { chartAltitude } from './chart';
import type { ElevationData } from '@/types/index.interface';
import styles from './Map.module.css';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Radius of the earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon1 - lon2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d * 1000; // Distance in meters
};

interface Props {
  url: string;
}

export default function MapWithElevation({ url }: Props) {
  const trackData = useParseGPX(url);

  const [elevationData, setElevationData] = useState<ElevationData[]>([]);
  const { chartData, chartOptions } = chartAltitude(elevationData);

  useEffect(() => {
    if (!trackData) {
      return;
    }
    if (trackData?.positions.length > 0) {
      const data: ElevationData[] = [];
      let cumulativeDistance = 0;

      for (let i = 1; i < trackData.positions.length; i++) {
        const prev = trackData.positions[i - 1];
        const cur = trackData.positions[i];
        const distance = calculateDistance(prev.lat, prev.lng, cur.lat, cur.lng);
        cumulativeDistance += distance;

        data.push({
          distance: Math.trunc(cumulativeDistance / 1000), // Distance in km
          elevation: cur.ele || 0, // Добавляем значение высоты
        });
      }

      setElevationData(data);
    }
  }, [trackData]);

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
      </MapContainer>

      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </>
  );
}
