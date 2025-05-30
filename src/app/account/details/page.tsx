import FormAccount from '@/components/UI/FormAccaunt/FormAccount';
import type { ServerResponse, TFormAccount } from '@/types/index.interface';
import styles from './AccountDetailsPage.module.css';
import { UserService } from '@/services/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { TUserDto } from '@/types/dto.types';

const userService = new UserService();

export default async function AccountDetailsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.idDB || !session.user.id) {
    return <h1>Не получен id пользователя</h1>;
  }

  const profile = (await userService.getProfile({
    idDB: session.user.idDB,
    isPrivate: true,
  })) as ServerResponse<TUserDto | null>; // запрос идет isPrivate:true, поэтому TUserDto

  // обновление данных аккаунта в БД
  const putAccount = async (dataForm: TFormAccount): Promise<ServerResponse<any>> => {
    'use server';

    const response = await userService.putAccount(dataForm);

    return response;
  };
  return (
    <div className={styles.wrapper}>
      {profile?.data && <FormAccount putAccount={putAccount} profile={profile.data} />}
    </div>
  );
}
