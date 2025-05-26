import { PasswordReset } from '@/database/mongodb/Models/Password-reset';

export async function checkRequestPasswordService(id: string) {
  const passwordResetDB = await PasswordReset.findOne({ tokenReset: id });

  if (!passwordResetDB) {
    throw new Error('Ошибка при проверке на сброс пароля');
  }

  return passwordResetDB.userId;
}
