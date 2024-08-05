import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { fetchOrganizerEdited, getOrganizer } from '@/actions/organizer';
import IconOrganizers from '@/components/Icons/IconOrganizers';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FromOrganizer from '@/components/UI/Forms/FromOrganizer/FromOrganizer';
import styles from './OrganizerEditPage.module.css';

export default async function OrganizerEditPage() {
  const session = await getServerSession(authOptions);

  const userIdDB = session?.user.idDB;

  const organizer = await getOrganizer({ creatorId: userIdDB });

  if (!userIdDB) {
    return <h1>Нет авторизации!</h1>;
  }

  return (
    <>
      <TitleAndLine
        title="Редактирование Организатора Чемпионатов"
        hSize={1}
        Icon={IconOrganizers}
      />
      {!organizer.ok && <h2 className={styles.error}>{organizer.message}</h2>}
      {organizer.data && (
        <FromOrganizer
          fetchOrganizerEdited={fetchOrganizerEdited}
          organizerForEdit={organizer.data}
        />
      )}
    </>
  );
}
