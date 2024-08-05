import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import IconOrganizers from '@/components/Icons/IconOrganizers';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { fetchOrganizerCreated, getOrganizer } from '@/actions/organizer';
import FromOrganizer from '@/components/UI/Forms/FromOrganizer/FromOrganizer';
import styles from './OrganizerCreatePage.module.css';

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

  // У пользователя еще не создавал Организатора Чемпионатов
  const hasNotOrganizer = organizer.message === 'Не найден запрашиваемый Организатор!';

  return (
    <>
      <TitleAndLine
        title="Создание/удаление Организатора Чемпионатов"
        hSize={1}
        Icon={IconOrganizers}
      />
      {hasNotOrganizer && <FromOrganizer fetchOrganizerCreated={fetchOrganizerCreated} />}
      {!organizer.ok && !hasNotOrganizer && (
        <h2 className={styles.error}>{organizer.message}</h2>
      )}
    </>
  );
}
