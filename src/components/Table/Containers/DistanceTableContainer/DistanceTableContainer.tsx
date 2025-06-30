'use client';

import { TDistanceDto } from '@/types/dto.types';
import TableDistances from '../../TableDistances/TableDistances';

type Props = {
  distances: TDistanceDto[];
  forModeration?: boolean;
};

export default function DistanceTableContainer({ distances, forModeration }: Props) {
  return (
    <div>
      <TableDistances distances={distances} forModeration={forModeration} />
    </div>
  );
}
