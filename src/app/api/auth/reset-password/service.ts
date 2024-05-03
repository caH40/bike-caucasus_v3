import { v4 as uuidv4 } from 'uuid';

import { User } from '@/Models/User';
import { PasswordReset } from '@/database/mongodb/Models/Password-reset';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { mailService } from '@/services/mail/nodemailer';

/**
 * Сервис сброса пароля
 */
export async function resetPasswordService(email: string): Promise<{
  message: string;
  email: string;
}> {
  await connectToMongo();
  const userDB = await User.findOne({ email });

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
  await mailService(target, tokenReset, email, userDB.username);

  return { message: 'Сброс пароля', email };
}
