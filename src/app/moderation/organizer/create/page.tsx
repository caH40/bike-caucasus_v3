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
  const organizer = await getOrganizer({});

  // Пользователь еще не создавал Организатора Чемпионатов.
  const hasNotOrganizer = organizer.message === 'Не найден запрашиваемый Организатор!';

  return (
    <>
      <TitleAndLine
        title="Создание/удаление Организатора Чемпионатов"
        hSize={1}
        Icon={IconOrganizers}
      />
      {hasNotOrganizer ? (
        <FromOrganizer fetchOrganizerCreated={fetchOrganizerCreated} />
      ) : (
        <h2>
          У Вас уже есть созданный Организатор, для редактирования данных перейдите в
          соответствующий пункт меню. У пользователя может быть только один Организатор
          Чемпионатов!
        </h2>
      )}
      {!organizer.ok && !hasNotOrganizer && (
        <h2 className={styles.error}>{organizer.message}</h2>
      )}
    </>
  );
}
