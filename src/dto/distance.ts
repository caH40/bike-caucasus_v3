// types
import { TDistanceDto } from '@/types/dto.types';
import { TDistance } from '@/types/models.interface';

export function distanceDto(data: TDistance): TDistanceDto {
  const _id = data._id.toString();
  const creator = data.creator.toString();
  const updatedAt = data.updatedAt.toISOString();
  const createdAt = data.createdAt.toISOString();
  return { ...data, _id, creator, createdAt, updatedAt };
}
