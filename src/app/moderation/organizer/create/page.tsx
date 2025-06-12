import IconOrganizers from '@/components/Icons/IconOrganizers';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { checkHasOrganizer, fetchOrganizerCreated } from '@/actions/organizer';
import FormOrganizer from '@/components/UI/Forms/FormOrganizer/FormOrganizer';
import styles from './OrganizerCreatePage.module.css';

// export const dynamic = 'force-dynamic';

/**
 * Страница создания/удаления Организатора Чемпионатов.
 */
export default async function OrganizerCreatePage() {
  const organizer = await checkHasOrganizer();

  const hasOrganizer = !!organizer.data?.urlSlug;

  if (!organizer.ok) {
    return <h2 className={styles.error}>{organizer.message}</h2>;
  }

  return (
    <>
      <TitleAndLine
        title="Создание/удаление Организатора Чемпионатов"
        hSize={1}
        Icon={IconOrganizers}
      />
      {/* Если нет Организатора то отображается форма создания */}
      {!hasOrganizer ? (
        <FormOrganizer fetchOrganizerCreated={fetchOrganizerCreated} />
      ) : (
        <h2>
          У Вас уже есть созданный Организатор, для редактирования данных перейдите в
          соответствующий пункт меню. У пользователя может быть только один Организатор
          Чемпионатов!
        </h2>
      )}
    </>
  );
}
