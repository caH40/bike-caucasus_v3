// import TableOrganizers from '@/components/Table/TableOrganizers/TableOrganizers';
import { getOrganizers } from '@/actions/organizer';
import TableOrganizers from '@/components/Table/TableOrganizers/TableOrganizers';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

// export const dynamic = 'force-dynamic';

/**
 * Страница с карточками Организаторов Чемпионатов.
 */
export default async function OrganizersPage() {
  const organizers = await getOrganizers();

  return (
    <>
      <TitleAndLine hSize={1} title="Организаторы Чемпионатов" />
      {organizers.data ? (
        <TableOrganizers organizers={organizers.data} />
      ) : (
        <h2>Организаторы не найдены!</h2>
      )}
    </>
  );
}
