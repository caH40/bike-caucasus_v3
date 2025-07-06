import { useEffect, useRef, useState } from 'react';

import { getDistanceResults } from '@/actions/distance-result';

// types
import { TDistanceResultOptionNames } from '@/types/index.interface';
import { TDistanceResultDto } from '@/types/dto.types';
import { toast } from 'sonner';

type Params = {
  initialData: TDistanceResultDto[];
  distanceId: string;
  query: TDistanceResultOptionNames;
};

/**
 * Запрос результатов на дистанции с клиента при изменении фильтра query.
 */
export function useGetDistanceResults({ distanceId, query, initialData }: Params) {
  const [filteredResults, setFilteredResults] = useState<TDistanceResultDto[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initialQueryRef = useRef<{
    distanceId: string;
    query: TDistanceResultOptionNames;
  } | null>(null);

  // Инициализируем данные из SSR. Если изменились данные, получаемые из серверного экшена.
  // Происходит при запросе на обновление таблиц, запрос происходит с параметром 'all'
  useEffect(() => {
    setFilteredResults(initialData);
  }, [initialData]);

  useEffect(() => {
    const nextQuery = { distanceId, query };
    if (
      !initialQueryRef.current ||
      (initialQueryRef.current?.distanceId === distanceId &&
        initialQueryRef.current?.query === query)
    ) {
      initialQueryRef.current = nextQuery;
      return;
    }

    setIsLoading(true);

    initialQueryRef.current = { distanceId, query };

    getDistanceResults(distanceId, query).then((r) => {
      if (r.ok) {
        setFilteredResults(r.data || []);
      } else {
        toast.error(r.message);
      }
      setIsLoading(false);
    });
  }, [distanceId, query, setFilteredResults]);

  return { filteredResults, isLoading };
}
