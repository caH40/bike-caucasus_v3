'use client';

import { useEffect, useState } from 'react';
import BlockFilterTrails from '../BlockFilterTrails/BlockFilterTrails';
import TrailCard from '../TrailCard/TrailCard';
import styles from './Trails.module.css';
import type { ResponseServer } from '@/types/index.interface';
import type { TTrailDto } from '@/types/dto.types';

type Props = {
  getTrails: ({
    // eslint-disable-next-line no-unused-vars
    bikeType,
  }: {
    bikeType: string;
  }) => Promise<ResponseServer<TTrailDto[] | null> | undefined>;
};

/**
 * Блок отображения карточек маршрутов и фильтров к ним.
 */
export default function Trails({ getTrails }: Props) {
  const [trails, setTrails] = useState<TTrailDto[] | null | undefined>(null);
  const [bikeType, setBikeType] = useState<string>(''); // Маршрут для какого типа велосипедов.

  useEffect(() => {
    getTrails({ bikeType }).then((res) => {
      setTrails(res?.data);
    });
  }, [getTrails, bikeType]);

  return (
    <>
      <BlockFilterTrails bikeType={bikeType} setBikeType={setBikeType} />
      <div className={styles.wrapper}>
        {trails ? (
          <>
            {trails.map((trail) => (
              <TrailCard trail={trail} key={trail._id} />
            ))}
          </>
        ) : (
          <div>Нет данных с сервера</div>
        )}
      </div>
    </>
  );
}
