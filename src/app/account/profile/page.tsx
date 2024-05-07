import SessionClient from '@/components/SessionClient/SessionClient';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { UserService } from '@/services/mongodb/UserService';

/**
 * Страница изменения данных профиля
 */
export default async function AccountSettings() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return <h1>Не получен email</h1>;
  }
  const idDB = session.user.idDB;
  const user = new UserService();
  const profile = await user.getProfile({ idDB });

  return (
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
  );
}
