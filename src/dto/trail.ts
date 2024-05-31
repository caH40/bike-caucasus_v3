import type { TTrailDto } from '@/types/dto.types';
import type { TAuthorFromUser, TTrailDocument } from '@/types/models.interface';

/**
 * Дто для маршрута (trail) получаемого на клиенте.
 */
export function dtoTrail(
  trail: Omit<TTrailDocument, 'author'> & { author: TAuthorFromUser }
): TTrailDto {
  const author = { ...trail.author, _id: String(trail.author._id) };

  const dto: TTrailDto = {
    ...trail,
    _id: String(trail),
    author,
    comments: trail.comments?.map((comment) => String(comment)) || [],
    likedBy: trail.likedBy?.map((like) => String(like)) || [],
    blocks: trail.blocks?.map((block) => ({ ...block, _id: String(block._id) })) || [],
  };
  return dto;
}
