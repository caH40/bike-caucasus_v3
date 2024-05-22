import { TNewsBlock } from './models.interface';

/**
 * Одна новость с сервера.
 */
export type TNewsHetOneDto = {
  _id: string;
  title: string;
  urlSlug: string;
  subTitle: string;
  blocks: TNewsBlockDto[];
  content: string;
  poster: string;
  hashtags: string[];
  viewsCount: number; // Счетчик просмотров
  likesCount: number; // Счетчик лайков
  sharesCount: number; // Счетчик шеров
  createdAt: Date;
  updatedAt: Date;
  author: TAuthor;
  isLikedByUser: boolean;
};

// Автор поста.
export type TAuthor = {
  id: number;
  provider: {
    image?: string;
  };
  imageFromProvider: boolean;
  image?: string;
  person: {
    firstName: string;
    lastName: string;
  };
};

// Блок новости без _id.
export type TNewsBlockDto = Omit<TNewsBlock, '_id'>;
