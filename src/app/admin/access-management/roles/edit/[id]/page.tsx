import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import { getPermissions, getRole, putRole } from '@/actions/permissions';
import IconEdit from '@/components/Icons/IconEdit';
import { FormRole } from '@/components/UI/Forms/FormRole/FormRole';
import ContainerTablePermissions from '@/components/Table/Containers/Permissions/ContainerTablePermissions';
import styles from './RoleEditPage.module.css';

type Props = {
  params: { id: string };
};

export default async function RoleEditPage({ params: { id } }: Props) {
  const [permissions, role] = await Promise.all([getPermissions(), getRole({ _id: id })]);

  if (!role || !role.data || !permissions) {
    return <h1>Не получены данные для редактирования Роли</h1>;
  }

  return (
    <>
      <TitleAndLine title="Редактирование Роли" Icon={IconEdit} />

      <div className={styles.spacer__form}>
        <FormRole role={role.data} permissions={permissions} putRole={putRole} />
      </div>

      <ContainerTablePermissions
        permissions={permissions}
        hiddenColumnHeaders={['Модерация разрешений', 'Выбор разрешений для удаления']}
        captionTitle={'Доступные разрешения'}
      />
    </>
  );
}
