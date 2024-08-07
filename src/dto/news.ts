import type {
  TAuthor,
  TNewsBlockDto,
  TNewsGetOneDto,
  TNewsInteractiveDto,
} from '@/types/dto.types';
import type { TNews } from '@/types/models.interface';
import { ObjectId } from 'mongoose';

/**
 * ДТО возвращаемых данных сервиса "Получение одной новости news.getOne()"
 */
export function dtoNewsGetOne(
  news: Omit<TNews, 'author'> & { author: TAuthor } & {
    isLikedByUser: boolean;
    commentsCount: number;
  }
): TNewsGetOneDto {
  const blocksDto: TNewsBlockDto[] = news.blocks.map((block) => ({
    text: block.text,
    image: block.image,
    imageTitle: block.imageTitle,
    position: block.position,
  }));

  const author = { ...news.author, _id: String(news.author?._id) };

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
    commentsCount: news.commentsCount,
    sharesCount: news.sharesCount,
    createdAt: news.createdAt,
    updatedAt: news.updatedAt,
    isLikedByUser: news.isLikedByUser,
    important: news.important,
    filePdf: news.filePdf,
    author,
  };
}

/**
 * ДТО возвращаемых данных сервиса "Получение интерактивных данных новости news.getInteractive()"
 */
export function serviceGetInteractiveToDto(
  document: { viewsCount: number; likesCount: number; likedBy?: ObjectId[] },
  isLikedByUser: boolean,
  commentsCount: number
): TNewsInteractiveDto {
  return {
    likesCount: document.likesCount,
    viewsCount: document.viewsCount,
    commentsCount,
    isLikedByUser,
  };
}

// /**
//  * ДТО возвращаемых данных сервиса "Получение интерактивных данных новости news.getInteractive()"
//  */
// export function dtoNewsGetMany(
//   news: { viewsCount: number; likesCount: number },
//   isLikedByUser: boolean
// ): TNewsInteractiveDto {
//   return {
//     likesCount: news.likesCount,
//     viewsCount: news.viewsCount,
//     isLikedByUser,
//   };
// }
