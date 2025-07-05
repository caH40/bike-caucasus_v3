import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { getDistanceResults } from '@/actions/distance-result';

// types
import { TDstanceResultOptionNames } from '@/types/index.interface';
import { TDistanceResultDto } from '@/types/dto.types';

type Params = {
  distanceId: string;
  setFilteredResults: Dispatch<SetStateAction<TDistanceResultDto[]>>;
  query: TDstanceResultOptionNames;
};

export function useGetDistanceResults({ distanceId, setFilteredResults, query }: Params) {
  const [status, setStatus] = useState<{
    errorMessage?: string;
    isError: boolean;
    isLoading: boolean;
  }>({
    isError: false,
    isLoading: false,
  });
  const initialQueryRef = useRef<{
    distanceId: string;
    query: TDstanceResultOptionNames;
  } | null>(null);

  useEffect(() => {
    setStatus({ isLoading: true, isError: false });

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
        setStatus({ isError: false, isLoading: false });
      } else {
        setStatus({ errorMessage: r.message, isError: true, isLoading: false });
      }
    });
  }, [distanceId, query, setFilteredResults]);

  return { ...status, setStatus };
}
