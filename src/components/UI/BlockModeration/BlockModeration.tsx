import { CellContext } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TDtoChampionship, TNewsGetOneDto, TTrailDto } from '@/types/dto.types';

import IconEditOld from '@/components/Icons/IconEditOld';
import IconDelete from '@/components/Icons/IconDelete';
import { translationForModeration } from '@/constants/texts';
import { deleteItem } from './delete';
import styles from './BlockModeration.module.css';
import { useUserData } from '@/store/userdata';

/**
 * Блок Модерации маршрутом.
 */
export default function BlockModeration({
  propsTable,
  type,
}: {
  propsTable:
    | CellContext<TTrailDto & { index: number }, unknown>
    | CellContext<TNewsGetOneDto, unknown>
    | CellContext<TDtoChampionship & { index: number }, unknown>;
  type: string;
}): JSX.Element {
  const router = useRouter();

  // Мета данные по client.
  const location = useUserData((s) => s.location);
  const deviceInfo = useUserData((s) => s.deviceInfo);

  const urlSlug = propsTable.row.original.urlSlug;

  const editItem = (id: string) => {
    if (id === 'undefined') {
      return toast.error(`Не получен urlSlug ${translationForModeration[type]?.a}!`);
    }

    router.push(`/moderation/${type}/edit/${id}`);
  };

  // Иконки управления новостью.
  const icons = [
    {
      id: 0,
      icon: IconEditOld,
      tooltip: 'Редактирование',
      getClick: () => editItem(urlSlug),
    },
    {
      id: 1,
      icon: IconDelete,
      tooltip: 'Удаление',
      getClick: () => deleteItem({ type, urlSlug, client: { location, deviceInfo } }),
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
