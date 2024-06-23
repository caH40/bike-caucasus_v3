import { TCommentDocument } from '@/types/models.interface';
import { Schema, model, models } from 'mongoose';

// Схема комментария для всех сущностей
const CommentSchema = new Schema<TCommentDocument>(
  {
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ссылка на пользователя
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    document: {
      _id: String, // _id документа к которому создан данный комментарий.
      type: String, // Тип Поста (документа, страницы): news, trail.
    },
  },
  { timestamps: true }
);

export const Comment = models.Comment || model<TCommentDocument>('Comment', CommentSchema);
