import bcrypt from 'bcrypt';

import { PasswordReset } from '@/database/mongodb/Models/Password-reset';
import { User } from '@/database/mongodb/Models/User';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { mailService } from '@/services/mail/nodemailer';

type Params = {
  password: string;
  userId: string;
};

export async function createNewPasswordService({ password: newPassword, userId }: Params) {
  await connectToMongo();

  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(newPassword, salt);

  const userDB = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { password: passwordHashed } }
  );

  if (!userDB) {
    throw new Error('Ошибка при изменении пароля');
  }

  await PasswordReset.deleteMany({ userId });

  const target = 'savedNewPassword';
  await mailService(target, 'нет токена', userDB.email, userDB.username, newPassword);

  return { message: 'Пароль изменен и отправлен на Вашу почту!' };
}
