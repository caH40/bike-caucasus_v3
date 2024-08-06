// ДТО для получение данных из календаря.

import { getDateTime } from '@/libs/utils/calendar';
import { TAuthor, TDtoOrganizer } from '@/types/dto.types';
import { TAuthorFromUser, TOrganizer } from '@/types/models.interface';

/**
 * ДТО массива Организаторов.
 */
export function dtoCOrganizers(
  organizers: (Omit<TOrganizer, 'creator'> & { creator: TAuthorFromUser })[]
): TDtoOrganizer[] {
  return organizers.map((organizer) => dtoCOrganizer(organizer));
}
/**
 * ДТО Организатора.
 */
export function dtoCOrganizer(
  organizer: Omit<TOrganizer, 'creator'> & { creator: TAuthorFromUser }
): TDtoOrganizer {
  const creator: TAuthor = { ...organizer.creator, _id: String(organizer.creator._id) };

  return {
    _id: String(organizer._id),
    creator,
    urlSlug: organizer.urlSlug,
    name: organizer.name,
    description: organizer.description,
    posterUrl: organizer.posterUrl,
    logoUrl: organizer.logoUrl,
    contactInfo: organizer.contactInfo,
    address: organizer.address,
    championshipCreationFee: organizer.championshipCreationFee,
    createdAt: getDateTime(organizer.createdAt).isoDate,
    updatedAt: getDateTime(organizer.updatedAt).isoDate,
  };
}
