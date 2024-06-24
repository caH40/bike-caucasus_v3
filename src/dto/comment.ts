import type { TCommentDto } from '@/types/dto.types';
import type { TAuthorFromUser, TCommentDocument } from '@/types/models.interface';

export function dtoComment(
  comments: (Omit<TCommentDocument, 'author'> & { author: TAuthorFromUser } & {
    isLikedByUser: boolean;
  })[]
): TCommentDto[] {
  return comments.map((comment) => {
    const author = { ...comment.author, _id: String(comment.author._id) };
    return {
      _id: String(comment._id),
      text: comment.text,
      author,
      count: comment.count,
      isLikedByUser: comment.isLikedByUser,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  });
}
