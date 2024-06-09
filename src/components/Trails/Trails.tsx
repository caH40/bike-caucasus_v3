'use client';

import { useEffect, useState } from 'react';

import { useLSTrails } from '@/hooks/local_storage/useLSTrails';
import { useLSTrailsInit } from '@/hooks/local_storage/useLSTrailsInit';
import BlockFilterTrails from '../BlockFilterTrails/BlockFilterTrails';
import TrailCard from '../TrailCard/TrailCard';
import type { ResponseServer } from '@/types/index.interface';
import type { TTrailDto } from '@/types/dto.types';
import styles from './Trails.module.css';

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

  useLSTrailsInit({ setBikeType });
  useLSTrails({ bikeType });

  useEffect(() => {
    getTrails({ bikeType }).then((res) => {
      setTrails(res?.data);
    });
  }, [getTrails, bikeType]);

  return (
    <>
      <BlockFilterTrails bikeType={bikeType} setBikeType={setBikeType} />
      <div className={styles.wrapper}>
        {trails && trails.map((trail) => <TrailCard trail={trail} key={trail._id} />)}
      </div>
    </>
  );
}
