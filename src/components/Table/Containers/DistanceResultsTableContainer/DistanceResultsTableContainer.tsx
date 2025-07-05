'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TDistanceStatsForClient, TDstanceResultOptionNames } from '@/types/index.interface';
import { getDistanceResults, putDistanceResults } from '@/actions/distance-result';
import TableDistanceResults from '../../TableDistanceResults/TableDistanceResults';
import styles from './DistanceResultsTableContainer.module.css';

// types
import { TDistanceResultDto } from '@/types/dto.types';
import { useEffect, useRef, useState } from 'react';
import Select from '@/components/UI/Select/Select';
import { distanceResultOptions } from '@/constants/buttons';

type Props = {
  results: TDistanceResultDto[];
  distanceStats?: Omit<TDistanceStatsForClient, 'bestResultMaleId' | 'bestResultFemaleId'>;
  distanceId: string;
};

export default function DistanceResultsTableContainer({
  results,
  distanceStats,
  distanceId,
}: Props) {
  const [query, setQuery] = useState<TDstanceResultOptionNames>('all');
  const [filteredResults, setFilteredResults] = useState<TDistanceResultDto[]>(results);
  const router = useRouter();
  const initialQueryRef = useRef<{
    distanceId: string;
    query: TDstanceResultOptionNames;
  } | null>(null);

  // Запрос результатов на клиенте согласно фильтрам query.
  useEffect(() => {
    if (
      !initialQueryRef.current ||
      JSON.stringify(initialQueryRef.current) === JSON.stringify({ distanceId, query })
    ) {
      initialQueryRef.current = { distanceId, query };
      return;
    }

    initialQueryRef.current = { distanceId, query };

    getDistanceResults(distanceId, query).then((r) => {
      if (r.ok) {
        setFilteredResults(r.data || []);
      } else {
        toast.error(r.message);
      }
    });
  }, [distanceId, query]);

  // Обработчик нажатия кнопки на обновление таблицы результатов.
  const handleClickUpdateTable = async (distanceId: string) => {
    try {
      const response = await putDistanceResults({ distanceId });

      if (response.ok) {
        toast.success(response.message);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  return (
    <div>
      <div className={styles.wrapper__controls}>
        <div className={styles.select}>
          <Select
            options={distanceResultOptions}
            state={query}
            setState={setQuery}
            name={'Результаты'}
            showEmpty={false}
          />
        </div>
      </div>

      <TableDistanceResults
        results={filteredResults}
        distanceStats={distanceStats}
        handleClickUpdateTable={handleClickUpdateTable}
        distanceId={distanceId}
      />
    </div>
  );
}
