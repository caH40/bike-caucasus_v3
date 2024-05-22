import type { TAuthor, TNewsBlockDto, TNewsHetOneDto } from '@/types/dto.types';
import type { TNews } from '@/types/models.interface';
export const NewsDto = {};

/**
 * ДТО возвращаемых данных сервиса "Получение одной новости news.getOne()"
 */
export function serviceGetOneToDto(
  news: Omit<TNews, 'author'> & { author: TAuthor } & {
    isLikedByUser: boolean;
  }
): TNewsHetOneDto {
  const blocksDto: TNewsBlockDto[] = news.blocks.map((block) => ({
    text: block.text,
    image: block.image,
    position: block.position,
  }));

  return {
    _id: news._id.toString(),
    title: news.title,
    urlSlug: news.urlSlug,
    subTitle: news.subTitle,
    blocks: blocksDto,
    content: news.content,
    poster: news.poster,
    hashtags: news.hashtags,
    viewsCount: news.viewsCount,
    likesCount: news.likesCount,
    sharesCount: news.sharesCount,
    createdAt: news.createdAt,
    updatedAt: news.updatedAt,
    isLikedByUser: news.isLikedByUser,
    author: news.author,
  };
}
