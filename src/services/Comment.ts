import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { ResponseServer } from '@/types/index.interface';
import { TCommentDto } from '@/types/dto.types';
import { Comment as CommentModel } from '@/database/mongodb/Models/Comment';
import { TAuthorFromUser, TCommentDocument } from '@/types/models.interface';
import { dtoComment } from '@/dto/comment';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { User } from '@/database/mongodb/Models/User';
import mongoose from 'mongoose';

export class CommentService {
  private dbConnection: () => Promise<void>;
  private errorLogger: (error: unknown) => Promise<void>; // eslint-disable-line no-unused-vars
  private handlerErrorDB: (error: unknown) => ResponseServer<null>; // eslint-disable-line no-unused-vars
  constructor() {
    this.dbConnection = connectToMongo;
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }
  /**
   * Получение всех комментариев для страницы(поста).
   */
  public async getMany({
    document,
    idUserDB,
  }: {
    document: { _id: string; type: 'news' | 'trail' };
    idUserDB?: string;
  }): Promise<ResponseServer<TCommentDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Получение комментариев для поста.
      const commentsDB: (Omit<TCommentDocument, 'author'> & { author: TAuthorFromUser } & {
        isLikedByUser: boolean;
      })[] = await CommentModel.find({ document })
        .populate({
          path: 'author',
          select: [
            'id',
            'likedBy',
            'person.firstName',
            'person.lastName',
            'provider.image',
            'imageFromProvider',
            'image',
          ],
        })
        .lean();

      if (idUserDB) {
        commentsDB
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .forEach((comment) => {
            comment.isLikedByUser = comment.likedBy.some((like) => String(like) === idUserDB);
            comment.likedBy = [];
          });
      }

      // Возвращаем Массив комментариев и успешный статус.
      return {
        data: dtoComment(commentsDB),
        ok: true,
        message: 'Комментарии к посту.',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Сохранение нового комментария.
   */
  public async post({
    authorIdDB,
    text,
    document,
  }: {
    authorIdDB: string;
    text: string;
    document: {
      _id: string;
      type: 'news' | 'trail';
    };
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const userDb = await User.findOne({ _id: authorIdDB });

      if (!userDb) {
        throw new Error(
          `Не найден пользователь в БД с _id:${authorIdDB}, создавший комментарий.`
        );
      }

      await CommentModel.create({ author: authorIdDB, text, document });

      // Возвращаем успешный статус.
      return {
        data: null,
        ok: true,
        message: 'Комментарий сохранен в БД.',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Подсчет лайков комментария.
   * @param param0
   * @returns
   */
  public async countLike({
    idUserDB,
    idComment,
  }: {
    idUserDB: string;
    idComment: string;
  }): Promise<ResponseServer<any>> {
    try {
      // Подключение к БД.
      this.dbConnection();

      const userDB = await User.findOne({ _id: idUserDB });
      if (!userDB) {
        throw new Error(`Не найден пользователь с _id:${userDB}`);
      }

      const commentDB: TCommentDocument | null = await CommentModel.findOne({ _id: idComment });
      if (!commentDB) {
        throw new Error(`Комментарий не найден с _id:${idComment}`);
      }

      const idUserDBObj = new mongoose.Types.ObjectId(idUserDB);

      if (commentDB.likedBy.includes(idUserDBObj)) {
        const userIndex = commentDB.likedBy.indexOf(idUserDBObj);
        commentDB.likedBy.splice(userIndex, 1);
        commentDB.count.likes = commentDB.likedBy.length;
      } else {
        commentDB.likedBy.push(idUserDBObj);
        commentDB.count.likes = commentDB.likedBy.length;
      }

      await commentDB.save();

      return {
        data: null,
        ok: true,
        message: `Учет лайка от пользователя _id:${idUserDB}`,
      };
    } catch (error) {
      this.errorLogger(error); // логирование
      return this.handlerErrorDB(error);
    }
  }
}
