import {
  IUserModel,
  TAuthorFromUser,
  TBlockTrail,
  TLogsErrorModel,
  TNewsBlock,
  TRoleModel,
  TTrailDocument,
} from './models.interface';

/**
 * Одна новость с сервера.
 */
export type TNewsGetOneDto = {
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

/**
 * Дто автора поста для публичного доступа. !!! Изменить название с обозначением Dto.
 */
export type TAuthor = Omit<TAuthorFromUser, '_id'> & { _id: string };

// Блок новости без _id.
export type TNewsBlockDto = Omit<TNewsBlock, '_id'>;

// Интерактивный блок новостей
export type TNewsInteractiveDto = {
  viewsCount: number;
  likesCount: number;
  isLikedByUser: boolean;
};

/**
 * Типы модели блока новости.
 */
export type TRoleDto = Omit<TRoleModel, '_id'> & { _id: string };

/**
 * Лог ошибки на сервере (фронте).
 */
export type TGetErrorsDto = Omit<TLogsErrorModel, '_id'> & { id: number; _id: string };

/**
 * Профиль пользователя, получаемый с сервера на клиент.
 */
export type TUserDto = Omit<IUserModel, '_id' | 'role' | 'credentials'> & {
  _id: string;
  role: TRoleDto;
  credentials: {
    username: string;
  } | null;
};

/**
 * Профиль пользователя, получаемый с сервера на клиент (Публичный).
 */
export type TUserDtoPublic = Omit<TUserDto, 'provider' | 'email' | 'person'> & {
  provider: {
    name: string;
    image?: string;
  } | null;
  person: {
    firstName: string;
    patronymic: string;
    lastName: string;
    ageCategory: string; // birthday заменён на ageCategory
    gender: 'male' | 'female';
    bio: string;
  };
};

export type TBlockTrailDto = Omit<TBlockTrail, '_id'> & { _id: string };

export type TTrailDto = Omit<
  TTrailDocument,
  '_id' | 'author' | 'comments' | 'blocks' | 'comments' | 'likedBy'
> & {
  _id: string;
  blocks: TBlockTrailDto[];
  comments: string[];
  likedBy: string[];
  author: TAuthor;
};
