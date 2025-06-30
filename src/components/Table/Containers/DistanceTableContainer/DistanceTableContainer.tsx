'use client';

import { TDistanceDto } from '@/types/dto.types';
import TableDistances from '../../TableDistances/TableDistances';

type Props = {
  distances: TDistanceDto[];
};

export default function DistanceTableContainer({ distances }: Props) {
  return (
    <div>
      <TableDistances distances={distances} />
    </div>
  );
}
