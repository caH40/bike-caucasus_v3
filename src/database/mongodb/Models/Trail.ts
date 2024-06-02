import mongoose, { Schema, model, models } from 'mongoose';
import { TTrailDocument } from '../../../types/models.interface';

const trailSchema = new Schema<TTrailDocument>(
  {
    title: { type: String, required: true, trim: true },
    poster: { type: String }, // ССылка на изображение обложки Маршрута.
    urlSlug: { type: String, required: true, unique: true }, // Последняя часть url страницы с маршрутом.
    region: { type: String, trim: true }, // Регион в котором проходит маршрут.
    bikeType: { type: String, default: 'road' },
    startLocation: { type: String, trim: true }, // Город или место у которого есть название.
    turnLocation: { type: String, trim: true }, // Город или место у которого есть название.
    finishLocation: { type: String, trim: true }, // Город или место у которого есть название.
    distance: { type: Number, min: 0 }, // Расстояние в километрах.
    ascent: { type: Number, min: 0 }, // Набор высоты в метрах.

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

    // fileTrek: { type: String, trim: true }, // Трек маршрута url до файла в облаке.
    garminConnect: { type: String, trim: true }, // Url трека маршрута на GarminConnect.
    komoot: { type: String, trim: true }, // Url трека маршрута Komoot.
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: [] }],
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],

    count: {
      views: { type: Number, default: 0 }, // Счетчик просмотров
      likes: { type: Number, default: 0 }, // Счетчик лайков
      shares: { type: Number, default: 0 }, // Счетчик шеров
    },

    difficultyLevel: { type: String, default: 'Лёгкий' }, // Добавлено поле для уровня сложности
    rating: { type: Number, min: 0, max: 5 }, // Поле для рейтинга маршрута.
    hashtags: [String],
    isApproved: { type: Boolean, default: false }, // Прошел ли проверку модератора
  },
  { timestamps: true }
);

// Индексация для часто используемых полей
trailSchema.index({ title: 1 });
trailSchema.index({ state: 1 });
trailSchema.index({ postedBy: 1 });

export const Trail = models.Trail || model<TTrailDocument>('Trail', trailSchema);
