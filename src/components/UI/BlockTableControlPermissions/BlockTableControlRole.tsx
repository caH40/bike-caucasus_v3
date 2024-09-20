import { CellContext } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import IconEditOld from '@/components/Icons/IconEditOld';
import IconDelete from '@/components/Icons/IconDelete';
import { deleteItem } from './delete';
import { TRoleDto } from '@/types/dto.types';
import styles from './BlockTableControlPermissions.module.css';

/**
 * Блок Модерации маршрутом.
 */
export default function BlockTableControlRole({
  propsTable,
}: {
  propsTable: CellContext<TRoleDto & { index: number }, string>;
}): JSX.Element {
  const router = useRouter();

  const _id = propsTable.row.original._id;

  const editItem = (id: string) => {
    if (!id || id === 'undefined') {
      return toast.error('Не получен _id Роли в БД!');
    }

    router.push(`/admin/access-management/roles/edit/${id}`);
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
      getClick: () => deleteItem({ type: 'roles', _id }),
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
          tooltip={{ text: icon.tooltip, id: `BlockTableControlRole${index}` }}
        />
      ))}
    </div>
  );
}
