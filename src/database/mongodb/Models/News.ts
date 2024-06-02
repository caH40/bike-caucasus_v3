import { Schema, model, models } from 'mongoose';

import type { TNews } from '@/types/models.interface';

// Схема новости
const NewsSchema = new Schema<TNews>(
  {
    title: { type: String, required: true }, // Заголовок новости.
    urlSlug: { type: String, required: true, unique: true }, // Последняя часть url страницы с новостью.
    subTitle: { type: String, required: true }, // Кратное описание для отображения поста в ленте.
    blocks: [
      {
        text: { type: String },
        image: { type: String },
        title: { type: String, trim: true },
        imageTitle: { type: String },
        position: { type: Number },
        video: { type: String, trim: true }, // Url видео с ютуба.
      },
    ],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ссылка на автора новости
    poster: { type: String }, // ССылка на обложку новости.
    hashtags: [{ type: String }], // к какой категории относится новость (анонс, результаты и т.д.).
    viewsCount: { type: Number, default: 0 }, // Счетчик просмотров
    likesCount: { type: Number, default: 0 }, // Счетчик лайков
    sharesCount: { type: Number, default: 0 }, // Счетчик шеров
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Модель новости
export const News = models.News || model<TNews>('News', NewsSchema);
