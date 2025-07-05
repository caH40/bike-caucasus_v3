import { TDistanceResultDto, TRiderForDistanceResultDto } from '@/types/dto.types';
import { TDistanceResultWithPosition } from '@/types/index.interface';
import { IUserModel, TGap } from '@/types/models.interface';

/**
 * ДТО результата на дистанции.
 */
export function distanceResultDto(
  result: TDistanceResultWithPosition & { currentGaps: TGap }
): TDistanceResultDto {
  const { championship, ...r } = result;

  return {
    ...r,
    _id: result._id.toString(),
    startDate: championship.startDate.toISOString(),
    championshipUrlSlug: championship.urlSlug,
    trackDistance: result.trackDistance.toString(),
    raceResult: result.raceResult.toString(),
    rider: riderDto(result.rider),
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  };
}

/**
 * ДТО райдера .
 */
export function riderDto(rider: IUserModel): TRiderForDistanceResultDto {
  const image = rider.imageFromProvider ? rider.provider?.image : rider.image;

  return {
    id: rider.id,
    firstName: rider.person.firstName,
    lastName: rider.person.lastName,
    patronymic: rider.person.patronymic,
    gender: rider.person.gender,
    image,
  };
}
