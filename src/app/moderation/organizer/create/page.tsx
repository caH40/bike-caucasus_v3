import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import IconOrganizers from '@/components/Icons/IconOrganizers';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { getOrganizer } from '@/actions/organizer';
import styles from './OrganizerCreatePage.module.css';
import FromOrganizer from '@/components/UI/Forms/FromOrganizer/FromOrganizer';

// export const dynamic = 'force-dynamic';

/**
 * Страница создания/удаления Организатора Чемпионатов.
 */
export default async function OrganizerCreatePage() {
  const session = await getServerSession(authOptions);

  const userIdDB = session?.user.idDB;
  if (!userIdDB) {
    return <h1>Нет авторизации!</h1>;
  }

  const organizer = await getOrganizer({ creatorId: userIdDB });

  return (
    <>
      <TitleAndLine
        title="Создание/удаление Организатора Чемпионатов"
        hSize={1}
        Icon={IconOrganizers}
      />
      {!organizer.ok && <h2 className={styles.error}>{organizer.message}</h2>}
      {organizer.message === 'Не найден запрашиваемый Организатор!' && <FromOrganizer />}
    </>
  );
}
