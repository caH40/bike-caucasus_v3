import { useEffect, useState } from 'react';

import { calculateDistance } from '@/libs/utils/calculate-distance';
import { ElevationData, TrackData } from '@/types/index.interface';

type Props = {
  trackData: TrackData | null;
};

/**
 * Пользовательский хук для вычисления данных высоты на основе данных трека.
 *
 * @param {Props} props - Свойства для хука.
 * @param {TrackData | null} props.trackData - Данные трека.
 * @returns {ElevationData[]} Массив данных высота/дистанция.
 */

export default function useElevation({ trackData }: Props): ElevationData[] {
  // Массив данных высота/дистанция.
  const [elevationData, setElevationData] = useState<ElevationData[]>([]);

  useEffect(() => {
    // Если данные трека отсутствуют, выходим из эффекта.
    if (!trackData) {
      return;
    }

    // Если массив позиций в данных трека не пустой.
    if (trackData?.positions.length > 0) {
      const data: ElevationData[] = [];
      let cumulativeDistance = 0;

      // Проходим по всем позициям, начиная со второй.
      for (let i = 1; i < trackData.positions.length; i++) {
        const prev = trackData.positions[i - 1];
        const cur = trackData.positions[i];

        // Вычисляем расстояние между предыдущей и текущей позициями.
        const distance = calculateDistance(prev.lat, prev.lng, cur.lat, cur.lng);
        cumulativeDistance += distance;

        // Добавляем в массив данных объект с текущей дистанцией и высотой.
        data.push({
          distance: Math.trunc(cumulativeDistance / 1000), // Distance in km
          elevation: cur.ele || 0, // Добавляем значение высоты
        });
      }

      // Обновляем состояние с новыми данными высоты.
      setElevationData(data);
    }
  }, [trackData]);

  return elevationData;
}
