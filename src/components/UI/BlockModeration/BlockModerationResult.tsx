import IconEditOld from '@/components/Icons/IconEditOld';
import IconDelete from '@/components/Icons/IconDelete';
import styles from './BlockModeration.module.css';
import { deleteResult } from '@/actions/result-race';
import { toast } from 'sonner';
import { useResultsRace } from '@/store/results';

type Props = {
  resultIdDB: string; // id результата в БД.
};

/**
 * Блок Модерации результата райдера из Таблицы результатов.
 */
export default function BlockModerationResult({ resultIdDB }: Props): JSX.Element {
  const setTriggerResultTable = useResultsRace((state) => state.setTriggerResultTable);

  const editItem = (id: string) => {
    console.log(id);
  };
  const deleteItem = async (id: string) => {
    const confirmDelete = confirm(`Вы действительно хотите удалить результат?`);
    if (!confirmDelete) {
      return toast.warning('Отмена удаления результата!');
    }

    const res = await deleteResult({ _id: id });

    if (res.ok) {
      toast.success(res.message);
      setTriggerResultTable();
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
    },
    {
      id: 1,
      icon: IconDelete,
      tooltip: 'Удаление',
      getClick: () => deleteItem(resultIdDB),
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
          tooltip={{ text: icon.tooltip, id: `blockModeration${index}` }}
        />
      ))}
    </div>
  );
}
