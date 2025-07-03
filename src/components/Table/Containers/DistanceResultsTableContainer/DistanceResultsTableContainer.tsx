'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TDistanceStatsForClient } from '@/types/index.interface';
import { putDistanceResults } from '@/actions/distance-result';
import TableDistanceResults from '../../TableDistanceResults/TableDistanceResults';

// types
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
  const router = useRouter();
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
      <TableDistanceResults
        results={results}
        distanceStats={distanceStats}
        handleClickUpdateTable={handleClickUpdateTable}
        distanceId={distanceId}
      />
    </div>
  );
}
