import IconEdit from '@/components/Icons/IconEdit';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

type Props = {};

export default function page({}: Props) {
  return (
    <>
      <TitleAndLine title="Редактирование Роли и Разрешений" Icon={IconEdit} />
      <p>
        Выберите необходимое Разрешение для редактирования из таблицы на странице &quot;Список и
        Создание&quot;
      </p>
    </>
  );
}
