import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormPermissions from '@/components/UI/Forms/FormPermissions/FormPermissions';
import { getPermission } from '@/actions/permissions';
import IconEdit from '@/components/Icons/IconEdit';

type Props = {
  params: { id: string };
};

export default async function RoleEditPage({ params }: Props) {
  const permission = await getPermission({ _id: params?.id });

  return (
    <>
      <TitleAndLine title="Редактирование Роли" Icon={IconEdit} />

      <div>{permission ? <FormPermissions permission={permission} /> : 'Не найдена Роль'}</div>
    </>
  );
}
