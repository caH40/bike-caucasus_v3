import { Schema, model, models } from 'mongoose';

// Схема новости
const NewsSchema = new Schema(
  {
    title: { type: String, required: true }, // Заголовок новости.
    urlSlug: { type: String, required: true, unique: true }, // Последняя часть url страницы с новостью.
    subTitle: { type: String, required: true }, // Кратное описание для отображения поста в ленте.
    blocks: [{ text: { type: String }, image: { type: String }, position: { type: Number } }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ссылка на автора новости
    poster: { type: String }, // ССылка на обложку новости.
    hashtags: [{ type: String }], // к какой категории относится новость (анонс, результаты и т.д.).
  },
  { timestamps: true }
);

// Модель новости
export const News = models.News || model('News', NewsSchema);