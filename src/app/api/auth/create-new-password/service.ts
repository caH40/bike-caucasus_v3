import bcrypt from 'bcrypt';

import { PasswordReset } from '@/database/mongodb/Models/Password-reset';
import { User } from '@/database/mongodb/Models/User';

import { mailService } from '@/services/mail/nodemailer';
import { type IUserModel } from '@/types/models.interface';

type Params = {
  password: string;
  userId: string;
};

/**
 * Сервис для создания нового пароля для пользователя.
 * @param  newPassword - Новый пароль пользователя.
 * @param  userId - Идентификатор пользователя.
 */
export async function createNewPasswordService({ password: newPassword, userId }: Params) {
  // Хеширование нового пароля
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(newPassword, salt);

  // Обновление пароля пользователя в базе данных
  const userDB: IUserModel | null = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { 'credentials.password': passwordHashed } }
  );

  // Проверка успешного обновления пароля пользователя
  if (!userDB || !userDB.credentials) {
    throw new Error('Ошибка при изменении пароля');
  }

  // Удаление записей о сбросе пароля
  await PasswordReset.deleteMany({ userId });

  const auth = {
    token: 'нет токена',
    username: userDB.credentials.username,
    password: newPassword,
  };

  // Отправка уведомления о смене пароля на почту
  const target = 'savedNewPassword';
  await mailService({ target, auth, email: userDB.email });

  return { message: 'Пароль изменен и отправлен на Вашу почту!' };
}
