import { toast } from 'sonner';

import IconEditOld from '@/components/Icons/IconEditOld';
import IconDelete from '@/components/Icons/IconDelete';

import { deleteItem } from './delete';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

/**
 * Блок Модерации таблицы начисления очков за этап серии.
 */
export default function BlockTableControlTableRacePointsTable({
  _id,
  name,
}: {
  _id: string;
  name: string;
}): JSX.Element {
  const router = useRouter();

  const editItem = (id: string) => {
    if (!id || id === 'undefined') {
      return toast.error(`Не получен _id ${_id}!`);
    }

    toast.success(`Получен _id ${_id}!`);
  };

  // Иконки управления Разрешениями.
  const icons = [
    {
      id: 0,
      icon: IconEditOld,
      tooltip: 'Редактирование',
      getClick: () => editItem(_id),
      colors: { default: 'green', hover: '#ec9c07' },
    },
    {
      id: 1,
      icon: IconDelete,
      tooltip: 'Удаление',
      getClick: () => deleteItem({ _id, name, router }),
      colors: { default: 'red', hover: '#ec9c07' },
    },
  ];

  return (
    <div className={styles.wrapper}>
      {icons.map((icon, index) => (
        <icon.icon
          getClick={icon.getClick}
          key={icon.id}
          squareSize={20}
          colors={icon.colors}
          tooltip={{ text: icon.tooltip, id: `BlockTableControlPermissions${index}` }}
        />
      ))}
    </div>
  );
}
