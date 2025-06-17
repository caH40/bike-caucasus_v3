import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import IconEditOld from '@/components/Icons/IconEditOld';
import IconDelete from '@/components/Icons/IconDelete';
import { deleteResult } from '@/actions/result-race';
import styles from './BlockModeration.module.css';

type Props = {
  resultIdDB: string; // id результата в БД.
};

/**
 * Блок Модерации результата райдера из Таблицы результатов.
 */
export default function BlockModerationResult({ resultIdDB }: Props): JSX.Element {
  const router = useRouter();

  const editItem = (id: string) => {
    router.push(`/moderation/championship/protocol/edit/${id}`);
  };
  const deleteItem = async (id: string) => {
    const confirmDelete = confirm(`Вы действительно хотите удалить результат?`);
    if (!confirmDelete) {
      return toast.warning('Отмена удаления результата!');
    }

    const res = await deleteResult({ _id: id });

    if (res.ok) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  // Иконки управления новостью.
  const icons = [
    {
      id: 0,
      icon: IconEditOld,
      tooltip: 'Редактирование',
      getClick: () => editItem(resultIdDB),
      propsIcon: { colors: { hover: '#ec9c07' } },
    },
    {
      id: 1,
      icon: IconDelete,
      tooltip: 'Удаление',
      getClick: () => deleteItem(resultIdDB),
      propsIcon: { colors: { default: 'red' } },
    },
  ];

  return (
    <div className={styles.wrapper}>
      {icons.map((icon, index) => (
        <icon.icon
          getClick={icon.getClick}
          key={icon.id}
          squareSize={20}
          tooltip={{ text: icon.tooltip, id: `blockModeration${index}` }}
          {...icon.propsIcon}
        />
      ))}
    </div>
  );
}
