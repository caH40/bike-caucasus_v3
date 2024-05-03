import { models, Schema, model } from 'mongoose';

const TeamSchema = new Schema({
  id: { type: String },
  name: { type: String, required: true },
});
const ProviderSchema = new Schema({
  providerAccountId: { type: String, unique: true },
  image: { type: String },
});

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  emailConfirm: { type: Boolean, default: false },
  phone: { type: String, default: null },
  firstName: { type: String },
  patronymic: { type: String },
  lastName: { type: String },
  gender: { type: String },
  birthday: { type: Date, default: null },
  city: { type: String, default: null },
  team: { type: TeamSchema, default: null },
  role: { type: String }, // !!!! изменить структуру данных, добавить разрешения
  image: { type: String }, // пусть до картинки
  yandex: { type: ProviderSchema }, // данные для аутентификации с помощью сервисов
  vk: { type: ProviderSchema }, // данные для аутентификации с помощью сервисов
  google: { type: ProviderSchema }, // данные для аутентификации с помощью сервисов
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = models.User || model('User', userSchema);
