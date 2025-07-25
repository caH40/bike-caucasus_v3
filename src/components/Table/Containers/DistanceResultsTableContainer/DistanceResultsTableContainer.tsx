'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { putDistanceResults } from '@/actions/distance-result';
import Select from '@/components/UI/Select/Select';
import { distanceResultOptions } from '@/constants/buttons';
import { useGetDistanceResults } from '@/hooks/fetch/useGetDistanceResults';
import TableDistanceResults from '../../TableDistanceResults/TableDistanceResults';
import styles from './DistanceResultsTableContainer.module.css';

// types
import { TDistanceStatsForClient, TDistanceResultOptionNames } from '@/types/index.interface';
import { TDistanceResultDto } from '@/types/dto.types';

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
  const [query, setQuery] = useState<TDistanceResultOptionNames>('all');
  const router = useRouter();

  // Запрос результатов на клиенте согласно фильтрам query.
  const { filteredResults } = useGetDistanceResults({
    distanceId,
    query,
    initialData: results,
  });

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
