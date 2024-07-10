'use client';

import { useEffect, useMemo, useState } from 'react';

import { useActiveFiltersTrails } from '@/hooks/useActiveFiltersTrails';
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
    // eslint-disable-next-line no-unused-vars
    region,
    // eslint-disable-next-line no-unused-vars
    difficultyLevel,
    // eslint-disable-next-line no-unused-vars
    search,
  }: {
    bikeType: string;
    region: string;
    difficultyLevel: string;
    search: string;
  }) => Promise<ResponseServer<TTrailDto[] | null> | undefined>;
};

/**
 * Блок отображения карточек маршрутов и фильтров к ним.
 */
export default function Trails({ getTrails }: Props) {
  const [isFirstMounting, setIsFirstMounting] = useState<boolean>(true);
  const [trails, setTrails] = useState<TTrailDto[] | null | undefined>(null);
  const [bikeType, setBikeType] = useState<string>(''); // Маршрут для какого типа велосипедов.
  const [region, setRegion] = useState<string>('');
  const [difficultyLevel, setDifficultyLevel] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<string>('');
  const [sortTarget, setSortTarget] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const hasFilters = useActiveFiltersTrails({
    bikeType,
    region,
    difficultyLevel,
    search,
  });

  useLSTrailsInit({
    setBikeType,
    setRegion,
    setDifficultyLevel,
    setSortDirection,
    setSortTarget,
  });
  useLSTrails({ bikeType, region, difficultyLevel, sortDirection, sortTarget });

  // Сортировка маршрутов.
  const sortedTrails = useMemo(() => {
    if (!trails) {
      return [];
    }

    return [...trails].sort((a, b) => {
      const target = sortTarget as keyof TTrailDto;

      const aValue = a[target];
      const bValue = b[target];

      if (aValue === undefined || bValue === undefined) {
        return 0; // или другое значение по умолчанию, если одно из значений undefined
      }

      if (sortDirection === 'down') {
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return bValue - aValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          return bValue.localeCompare(aValue);
        }
      } else if (sortDirection === 'up') {
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue);
        }
      }
      return 0;
    });
  }, [trails, sortTarget, sortDirection]);

  useEffect(() => {
    if (isFirstMounting) {
      setIsFirstMounting(false);
      return;
    }
    const query = {
      bikeType: bikeType === 'нет фильтров' ? '' : bikeType,
      region: region === 'нет фильтров' ? '' : region,
      difficultyLevel: difficultyLevel === 'нет фильтров' ? '' : difficultyLevel,
      search,
    };

    // Если приходит значение 'нет фильтров', то запрашивать все данные, то есть ''.
    getTrails(query).then((res) => {
      setTrails(res?.data);
    });
  }, [getTrails, bikeType, region, difficultyLevel, isFirstMounting, search]);

  const resetFilters = () => {
    setBikeType('нет фильтров');
    setRegion('нет фильтров');
    setDifficultyLevel('нет фильтров');
    setSearch('');
  };

  return (
    <>
      <BlockFilterTrails
        bikeType={bikeType}
        setBikeType={setBikeType}
        region={region}
        setRegion={setRegion}
        difficultyLevel={difficultyLevel}
        setDifficultyLevel={setDifficultyLevel}
        hasFilters={hasFilters}
        resetFilters={resetFilters}
        quantityTrails={sortedTrails?.length}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortTarget={sortTarget}
        setSortTarget={setSortTarget}
        search={search}
        setSearch={setSearch}
      />
      <div className={styles.wrapper}>
        {sortedTrails &&
          sortedTrails.map((trail) => <TrailCard trail={trail} key={trail._id} />)}
      </div>
    </>
  );
}
