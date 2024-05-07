import SessionClient from '@/components/SessionClient/SessionClient';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { UserService } from '@/services/mongodb/UserService';
import styles from './AccountProfilePage.module.css';

const user = new UserService();
/**
 * Страница изменения данных профиля
 */
export default async function AccountProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.idDB) {
    return <h1>Не получен id пользователя</h1>;
  }

  const idDB = session.user.idDB;

  const profile = await user.getProfile({ idDB });

  return (
    <div className={styles.wrapper}>
      <div>
        <div>
          Server:<pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
        <hr />
        <div>
          DB:<pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
        <hr />
        <div>
          Client:
          <SessionClient />
        </div>
      </div>
    </div>
  );
}
