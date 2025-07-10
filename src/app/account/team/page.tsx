import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import UnderConstruction from '@/components/UnderConstruction/UnderConstruction';

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.idDB) {
    return <h1>Не получен id пользователя</h1>;
  }

  return (
    <div>
      <h1>Team</h1>
      <UnderConstruction />
    </div>
  );
}
