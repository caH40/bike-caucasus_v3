import { Schema, model, models } from 'mongoose';

// Схема комментария для всех сущностей
const CommentSchema = new Schema(
  {
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ссылка на пользователя
  },
  { timestamps: true }
);

export const Comment = models.Comment || model('Comment', CommentSchema);
