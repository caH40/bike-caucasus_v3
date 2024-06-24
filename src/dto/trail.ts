import type { TTrailDto } from '@/types/dto.types';
import type { TAuthorFromUser, TTrailDocument } from '@/types/models.interface';

/**
 * Дто для маршрута (trail) получаемого на клиенте.
 */
export function dtoTrail(
  trail: Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser } & {
    isLikedByUser: boolean;
    commentsCount: number;
  }
): TTrailDto {
  const author = { ...trail.author, _id: String(trail.author._id) };

  const dto: TTrailDto = {
    ...trail,
    _id: String(trail._id),
    author,
    commentsCount: trail.commentsCount,
    // likedBy: trail.likedBy?.map((like) => String(like)) || [],
    isLikedByUser: trail.isLikedByUser,
    blocks: trail.blocks?.map((block) => ({ ...block, _id: String(block._id) })) || [],
  };
  return dto;
}

/**
 * Дто для маршрутов (trails) получаемых на клиенте.
 */
export function dtoTrails(
  trails: (Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser } & {
    isLikedByUser: boolean;
    commentsCount: number;
  })[]
): TTrailDto[] {
  const dto: TTrailDto[] = trails.map((trail) => dtoTrail(trail));

  return dto;
}
