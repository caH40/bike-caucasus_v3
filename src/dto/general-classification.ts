// types
import { TGeneralClassificationDto } from '@/types/dto.types';
import { TGetOneGeneralClassificationFromMongo } from '@/types/mongo.types';

/**
 * ДТО генеральной классификации райдера.
 */
export function generalClassificationDto(
  gc: TGetOneGeneralClassificationFromMongo
): TGeneralClassificationDto {
  return {
    ...gc,
    _id: gc._id.toString(),
    championship: gc.championship.toString(),
    createdAt: gc.createdAt.toISOString(),
    updatedAt: gc.updatedAt.toISOString(),
    stages: gc.stages.map((g) => ({
      ...g,
      championship: g.championship.toString(),
    })),
  };
}
