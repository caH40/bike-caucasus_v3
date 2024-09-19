import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormPermissions from '@/components/UI/Forms/FormPermissions/FormPermissions';
import { getPermission } from '@/actions/permissions';
import IconEdit from '@/components/Icons/IconEdit';
import styles from './PermissionEditPage.module.css';

type Props = {
  params: { id: string };
};

export default async function PermissionEditPage({ params }: Props) {
  const permission = await getPermission({ _id: params?.id });

  return (
    <>
      <TitleAndLine title="Редактирование Разрешений" Icon={IconEdit} />

      <div className={styles.block}>
        {permission ? <FormPermissions permission={permission} /> : 'Не найдено разрешение'}
      </div>
    </>
  );
}
