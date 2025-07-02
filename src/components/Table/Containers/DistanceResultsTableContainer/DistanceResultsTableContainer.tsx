'use client';

import TableDistanceResults from '../../TableDistanceResults/TableDistanceResults';

// types
import { TDistanceResultDto } from '@/types/dto.types';

type Props = {
  results: TDistanceResultDto[];
};

export default function DistanceResultsTableContainer({ results }: Props) {
  return (
    <div>
      <TableDistanceResults results={results} />
    </div>
  );
}
