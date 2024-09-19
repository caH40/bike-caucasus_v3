import IconCreate from '@/components/Icons/IconCreate';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import styles from './PermissionsPage.module.css';
import { FormRole } from '@/components/UI/Forms/FormRole/FormRole';
import ContainerTablePermissions from '@/components/Table/Containers/Permissions/ContainerTablePermissions';
import { getPermissions } from '@/actions/permissions';

export const dynamic = 'force-dynamic';

type Props = {};

export default async function PermissionsPage({}: Props) {
  const permissions = await getPermissions();
  return (
    <>
      <TitleAndLine title="Создание Роли (набор разрешений)" Icon={IconCreate} />

      {/* Форма создания/редактирования роли. */}
      <div className={styles.block}>
        <FormRole permissions={permissions || []} />
      </div>

      <ContainerTablePermissions
        permissions={permissions}
        hiddenColumnHeaders={['Модерация разрешений', 'Выбор разрешений для удаления']}
        captionTitle={'Доступные разрешения'}
      />
    </>
  );
}
