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
  const [hasFilters, setHasFilters] = useState<boolean>(false);

  useLSTrailsInit({ setBikeType });
  useLSTrails({ bikeType });

  // Проверка наличия включенных фильтров.
  useEffect(() => {
    if (bikeType !== '' && bikeType !== 'нет фильтров') {
      setHasFilters(true);
    } else {
      setHasFilters(false);
    }
  }, [bikeType]);

  useEffect(() => {
    // Если приходит значение 'нет фильтров', то запрашивать все данные, то есть ''.
    getTrails({ bikeType: bikeType === 'нет фильтров' ? '' : bikeType }).then((res) => {
      setTrails(res?.data);
    });
  }, [getTrails, bikeType]);

  const resetFilters = () => {
    setBikeType('');
  };

  return (
    <>
      <BlockFilterTrails
        bikeType={bikeType}
        setBikeType={setBikeType}
        hasFilters={hasFilters}
      />
      <div className={styles.wrapper}>
        {trails && trails.map((trail) => <TrailCard trail={trail} key={trail._id} />)}
      </div>
    </>
  );
}
