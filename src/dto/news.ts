import type {
  TAuthor,
  TNewsBlockDto,
  TNewsHetOneDto,
  TNewsInteractiveDto,
} from '@/types/dto.types';
import type { TNews } from '@/types/models.interface';

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
    imageTitle: block.imageTitle,
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

/**
 * ДТО возвращаемых данных сервиса "Получение интерактивных данных новости news.getInteractive()"
 */
export function serviceGetInteractiveToDto(
  news: { viewsCount: number; likesCount: number },
  isLikedByUser: boolean
): TNewsInteractiveDto {
  return {
    likesCount: news.likesCount,
    viewsCount: news.viewsCount,
    isLikedByUser,
  };
}
