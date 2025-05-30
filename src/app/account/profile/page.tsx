import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import FormProfile from '@/components/UI/Forms/FormProfile/FormProfile';
import { UserService } from '@/services/user';
import type { ServerResponse } from '@/types/index.interface';
import type { TUserDto } from '@/types/dto.types';
import styles from './AccountProfilePage.module.css';

/**
 * Страница изменения данных профиля
 */
export default async function AccountProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.idDB || !session.user.id) {
    return <h1>Не получен id пользователя</h1>;
  }
  const userService = new UserService();
  const profile = (await userService.getProfile({
    idDB: session.user.idDB,
    isPrivate: true,
  })) as ServerResponse<TUserDto | null>;

  /**
   * Функция для обновления профиля пользователя.
   * @param dataFromClient Данные профиля пользователя.
   * @returns Результат операции обновления профиля.
   */
  const putProfile = async (dataFromClient: FormData): Promise<ServerResponse<any>> => {
    'use server';
    const userService = new UserService();
    const response = await userService.putProfile(dataFromClient);

    return response;
  };

  return (
    <div className={styles.wrapper}>
      {profile?.data && (
        <FormProfile formData={profile.data} putProfile={putProfile} idUser={session.user.id} />
      )}
    </div>
  );
}
