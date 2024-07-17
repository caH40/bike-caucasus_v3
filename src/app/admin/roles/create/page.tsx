import { getPermissions } from '@/actions/permissions';

import IconCreate from '@/components/Icons/IconCreate';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormPermissions from '@/components/UI/Forms/FormPermissions/FormPermissions';
import ContainerTablePermissions from '@/components/Table/Containers/Permissions/ContainerTablePermissions';
import styles from './PermissionsPage.module.css';

export const dynamic = 'force-dynamic';

type Props = {};

export default async function PermissionsPage({}: Props) {
  const permissions = await getPermissions();

  return (
    <>
      <TitleAndLine title="Создание Роли и Разрешений" Icon={IconCreate} />
      <TitleAndLine title="Создание Разрешения (доступа)" hSize={2} />

      <div className={styles.block}>
        <FormPermissions />
      </div>

      <ContainerTablePermissions permissions={permissions} />
    </>
  );
}
