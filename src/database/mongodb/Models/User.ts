import { IUserModel } from '@/types/models.interface';
import { models, Schema, model } from 'mongoose';
import { PreferencesSchema } from './Schema/UserPreferences';

const TeamSchema = new Schema({
  id: { type: Number, require: true }, // id номер, присваиваемый автоматически при регистрации
  name: { type: String, required: true },
});

const SocialSchema = new Schema({
  telegram: String,
  vk: String,
  youtube: String,
  komoot: String,
  strava: String,
  whatsapp: String,
  garminConnect: String,
});

const ProviderSchema = new Schema(
  {
    name: { type: String }, // провайдер с помощью которого произошла регистрация
    id: { type: String }, // провайдер с помощью которого произошла регистрация
    image: { type: String }, // путь до картинки профиля  сп провайдера}
  },
  { _id: false }
);

const userSchema = new Schema<IUserModel>(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
      validate: {
        validator: function (v: unknown) {
          return v !== null;
        },
        message: 'id cannot be null',
      },
    },
    credentials: {
      type: {
        username: { type: String }, // при регистрации через логин/пароль
        password: { type: String }, // при регистрации через логин/пароль
      },
      default: null,
    },
    provider: {
      type: ProviderSchema,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v: unknown) {
          return v !== null;
        },
        message: 'email cannot be null',
      },
    },
    emailConfirm: { type: Boolean, default: false }, // через соцсети автоматически true
    image: { type: String }, // путь до картинки профиля
    imageFromProvider: { type: Boolean, default: true }, // выбор картинки из БД или провайдера
    person: {
      firstName: { type: String },
      patronymic: { type: String },
      lastName: { type: String },
      birthday: { type: Date },
      gender: { type: String, default: 'male' },
      bio: { type: String },
    },
    preferences: { type: PreferencesSchema, default: { showPatronymic: true } },
    city: { type: String },
    phone: { type: String },
    team: { type: TeamSchema, default: null },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    social: { type: SocialSchema, default: {} },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = models.User || model<IUserModel>('User', userSchema);
