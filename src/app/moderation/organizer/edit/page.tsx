import { checkHasOrganizer, fetchOrganizerEdited, getOrganizer } from '@/actions/organizer';
import IconOrganizers from '@/components/Icons/IconOrganizers';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormOrganizer from '@/components/UI/Forms/FormOrganizer/FormOrganizer';
import styles from './OrganizerEditPage.module.css';

export default async function OrganizerEditPage() {
  const organizerChecked = await checkHasOrganizer();

  const urlSlug = organizerChecked.data?.urlSlug;
  if (!urlSlug) {
    return <h2>Не найден Организатора!</h2>;
  }

  const organizer = await getOrganizer({ urlSlug });

  return (
    <>
      <TitleAndLine
        title="Редактирование Организатора Чемпионатов"
        hSize={1}
        Icon={IconOrganizers}
      />
      {!organizer.ok && <h2 className={styles.error}>{organizer.message}</h2>}
      {organizer.data && (
        <FormOrganizer
          fetchOrganizerEdited={fetchOrganizerEdited}
          organizerForEdit={organizer.data}
        />
      )}
    </>
  );
}
