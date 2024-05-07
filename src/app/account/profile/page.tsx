import SessionClient from '@/components/SessionClient/SessionClient';

import { getServerSession } from 'next-auth';
import { fetchProfileService } from '@/app/api/profile/[id]/service';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

/**
 * Страница изменения данных профиля
 */
export default async function AccountSettings() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.email) {
    return <h1>Не получен email</h1>;
  }
  const profile = await fetchProfileService({ email: session.user.email, isPublic: false });

  return (
    <div>
      <div>
        Server:<pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
      <div>
        DB:<pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
      <div>
        Client:
        <SessionClient />
      </div>
    </div>
  );
}
