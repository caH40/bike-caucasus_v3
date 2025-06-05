import { TGeneralClassificationDto } from '@/types/dto.types';
import { TGeneralClassification } from '@/types/models.interface';

/**
 * ДТО генеральной классификации райдера.
 */
export function generalClassificationDto(
  gc: TGeneralClassification
): TGeneralClassificationDto {
  return {
    ...gc,
    _id: gc._id.toString(),
    championship: gc.championship.toString(),
    rider: gc.rider && gc.rider.toString(),
    createdAt: gc.createdAt.toISOString(),
    updatedAt: gc.updatedAt.toISOString(),
    stages: gc.stages.map((g) => ({
      ...g,
      championship: g.championship.toString(),
    })),
  };
}
