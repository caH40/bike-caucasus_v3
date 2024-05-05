import { models, Schema, model } from 'mongoose';

const TeamSchema = new Schema({
  id: { type: Number }, // id номер, присваиваемый автоматически при регистрации
  name: { type: String, required: true },
});

const userSchema = new Schema({
  credentials: {
    username: { type: String }, // при регистрации через логин/пароль
    password: { type: String }, // при регистрации через логин/пароль
  },
  provider: {
    name: { type: String }, // провайдер с помощью которого произошла регистрация
    id: { type: String }, // провайдер с помощью которого произошла регистрация
  },
  username: { type: String, unique: true }, // при регистрации через провайдера, берется слово до @, в дальнейшем можно изменять
  email: { type: String, unique: true },
  emailConfirm: { type: Boolean, default: false }, // через соцсети автоматически true
  image: { type: String }, // путь до картинки профиля
  person: {
    firstName: { type: String },
    patronymic: { type: String },
    lastName: { type: String },
    birthday: { type: Date },
    gender: { type: String },
  },
  city: { type: String },
  phone: { type: String },
  team: { type: TeamSchema, default: null },
  role: { type: String }, // !!!! изменить структуру данных, добавить разрешения
  social: {
    telegram: String,
    vk: String,
    youtube: String,
    komoot: String,
    strava: String,
    whatsapp: String,
    garminConnect: String,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = models.User || model('User', userSchema);
