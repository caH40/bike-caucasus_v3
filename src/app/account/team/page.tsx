import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import SessionClient from '@/components/SessionClient/SessionClient';
import { UserService } from '@/services/mongodb/UserService';
import { getServerSession } from 'next-auth';

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.idDB) {
    return <h1>Не получен id пользователя</h1>;
  }
  const idDB = session.user.idDB;
  const user = new UserService();
  const profile = await user.getProfile({ idDB });
  return (
    <div>
      <h1>Team</h1>
      <div>
        <div>{/* Server:<pre>{JSON.stringify(session, null, 2)}</pre> */}</div>
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
