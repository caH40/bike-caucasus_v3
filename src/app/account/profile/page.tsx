import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import FormProfile from '@/components/UI/Forms/FormProfile/FormProfile';
import { UserService } from '@/services/mongodb/UserService';
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
  const profile = await userService.getProfile({ idDB: session.user.idDB, isPrivate: true });

  const getDataClient = async (dataFromClient: FormData) => {
    'use server';
    const userService = new UserService();
    await userService.putProfile(dataFromClient);
    // console.log({ response });
  };

  return (
    <div className={styles.wrapper}>
      {profile?.data && (
        <FormProfile
          formData={profile.data}
          getDataClient={getDataClient}
          idUser={session.user.id}
        />
      )}
    </div>
  );
}
