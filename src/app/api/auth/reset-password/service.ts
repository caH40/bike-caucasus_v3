import { v4 as uuidv4 } from 'uuid';

import { User } from '@/Models/User';
import { PasswordReset } from '@/database/mongodb/Models/Password-reset';

import { mailService } from '@/services/mail/nodemailer';
import { type IUserModel } from '@/types/models.interface';

/**
 * Сервис сброса пароля
 */
export async function resetPasswordService(email: string): Promise<{
  message: string;
  email: string;
}> {
  const userDB: IUserModel | null = await User.findOne({
    email,
    credentials: { $exists: true, $ne: null },
  });

  if (!userDB) {
    return { message: 'Сброс пароля', email };
  }

  const tokenReset = uuidv4();

  await PasswordReset.create({
    userId: String(userDB._id),
    email,
    tokenReset,
    date: Date.now(),
  });

  const target = 'resetPassword';
  await mailService(target, tokenReset, email, userDB.credentials?.username ?? 'username');

  return { message: 'Сброс пароля', email };
}
