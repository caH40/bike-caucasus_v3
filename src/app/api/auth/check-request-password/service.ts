import { PasswordReset } from '@/database/mongodb/Models/Password-reset';
import { connectToMongo } from '@/database/mongodb/mongoose';

export async function checkRequestPasswordService(id: string) {
  await connectToMongo();
  const passwordResetDB = await PasswordReset.findOne({ tokenReset: id });

  if (!passwordResetDB) {
    throw new Error('Ошибка при проверке на сброс пароля');
  }

  return passwordResetDB.userId;
}
