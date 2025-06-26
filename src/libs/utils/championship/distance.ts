import { TDistanceDto } from '@/types/dto.types';
import { TOptions } from '@/types/index.interface';

export function createDistanceOptions(distances: TDistanceDto[]): TOptions[] {
  const options = distances.map((d) => ({
    id: d.distanceInMeter,
    translation: d.name,
    name: d._id,
  }));

  return [{ id: 0, translation: 'нет', name: 'null' }, ...options];
}
