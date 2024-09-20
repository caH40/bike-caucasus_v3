import { getRoles } from '@/actions/permissions';
import IconEdit from '@/components/Icons/IconEdit';
import ContainerTableRoles from '@/components/Table/Containers/Roles/ContainerTableRoles';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

type Props = {};

export default async function page({}: Props) {
  const roles = await getRoles();
  if (!roles.data) {
    return <h1>{`Ошибка при получении Ролей: ${roles.message}`}</h1>;
  }

  return (
    <>
      <TitleAndLine title="Редактирование Роли" Icon={IconEdit} />
      <p>
        Выберите необходимую Роль для редактирования из таблицы на странице &quot;Создание
        Роли&quot;
      </p>

      <ContainerTableRoles roles={roles.data} />
    </>
  );
}
