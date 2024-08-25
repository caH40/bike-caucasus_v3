import { CellContext } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TPermissionDto } from '@/types/dto.types';

import IconEditOld from '@/components/Icons/IconEditOld';
import IconDelete from '@/components/Icons/IconDelete';
import { translationForModeration } from '@/constants/texts';
import { deleteItem } from './delete';
import styles from './BlockTableControlAdmin.module.css';

/**
 * Блок Модерации маршрутом.
 */
export default function BlockTableControlAdmin({
  propsTable,
  type,
}: {
  propsTable: CellContext<TPermissionDto & { index: number }, unknown>;
  type: string;
}): JSX.Element {
  const router = useRouter();

  const _id = propsTable.row.original._id;

  const editItem = (id: string) => {
    if (id === 'undefined') {
      return toast.error(`Не получен _id ${translationForModeration[type]?.a}!`);
    }

    if (type === 'permissions') {
      router.push(`/admin/roles/edit/${type}/${id}`);
    }
  };

  // Иконки управления Разрешениями.
  const icons = [
    {
      id: 0,
      icon: IconEditOld,
      tooltip: 'Редактирование',
      getClick: () => editItem(_id),
    },
    {
      id: 1,
      icon: IconDelete,
      tooltip: 'Удаление',
      getClick: () => deleteItem({ type, _id }),
    },
  ];

  return (
    <div className={styles.wrapper}>
      {icons.map((icon, index) => (
        <icon.icon
          getClick={icon.getClick}
          key={icon.id}
          squareSize={20}
          colors={{ hover: '#ec9c07' }}
          tooltip={{ text: icon.tooltip, id: `blockTableControlAdmin${index}` }}
        />
      ))}
    </div>
  );
}
