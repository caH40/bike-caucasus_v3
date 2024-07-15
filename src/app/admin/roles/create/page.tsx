import IconCreate from '@/components/Icons/IconCreate';
import TablePermissions from '@/components/Table/TablePermissions/TablePermissions';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormPermissions from '@/components/UI/Forms/FormPermissions/FormPermissions';
import styles from './PermissionsPage.module.css';
import { getPermissions } from '@/actions/permissions';

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

      <TablePermissions permissions={permissions || []} />
    </>
  );
}
