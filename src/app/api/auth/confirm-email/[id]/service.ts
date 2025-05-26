import { User } from '@/Models/User';
import { UserConfirm } from '@/Models/User-confirm';

/**
 * Сервис подтверждения email, указанного при регистрации
 */
export async function confirmEmailService(activationToken: string): Promise<string> {
  const userConfirmDB = await UserConfirm.findOneAndDelete({ activationToken });

  if (userConfirmDB) {
    await User.findOneAndUpdate(
      { _id: userConfirmDB.userId },
      { $set: { emailConfirm: true } }
    );
    return 'Email подтверждён, аккаунт активирован!';
  }

  return 'Ссылка для активации устарела!';
}
