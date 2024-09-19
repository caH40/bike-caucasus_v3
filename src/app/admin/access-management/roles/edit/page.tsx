import { getRoles } from '@/actions/permissions';
import IconEdit from '@/components/Icons/IconEdit';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

type Props = {};

export default async function page({}: Props) {
  const roles = await getRoles();
  console.log(roles);

  return (
    <>
      <TitleAndLine title="Редактирование Роли" Icon={IconEdit} />
      <p>
        Выберите необходимую Роль для редактирования из таблицы на странице &quot;Создание
        Роли&quot;
      </p>
    </>
  );
}
