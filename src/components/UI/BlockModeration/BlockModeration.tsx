import { CellContext } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TNewsGetOneDto, TTrailDto } from '@/types/dto.types';
import { deleteTrail } from '@/actions/trail';
import IconEditOld from '@/components/Icons/IconEditOld';
import IconDelete from '@/components/Icons/IconDelete';
import { deleteNews } from '@/actions/news';
import { ResponseServer } from '@/types/index.interface';
import styles from './BlockModeration.module.css';

const dataCurrent = {
  trails: {
    m: 'маршрут',
    a: 'маршрута',
  },
  news: {
    m: 'новость',
    a: 'новости',
  },
} as { [key: string]: any };

/**
 * Блок Модерации маршрутом.
 */
export default function BlockModeration({
  propsTable,
  type,
}: {
  propsTable:
    | CellContext<TTrailDto & { index: number }, unknown>
    | CellContext<TNewsGetOneDto, unknown>;
  type: string;
}): JSX.Element {
  const router = useRouter();

  const urlSlug = propsTable.row.original.urlSlug;

  const editItem = (id: string) => {
    if (id === 'undefined') {
      return toast.error(`Не получен urlSlug ${dataCurrent[type]?.a}!`);
    }

    router.push(`/moderation/${type}/edit/${id}`);
  };

  /**
   * Обработка клика на удаление новости.
   */
  const deleteItem = async (url: string) => {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить ${dataCurrent[type]?.m} c urlSlug:${urlSlug}?`
    );
    if (!confirmed) {
      return toast.warning(`Отменён запрос на удаление ${dataCurrent[type]?.a}!`);
    }

    try {
      let res = {} as ResponseServer<null>;
      switch (type) {
        case 'trails':
          res = await deleteTrail(url);
          break;
        case 'news':
          res = await deleteNews(url);
          break;

        default:
          throw new Error('Не передан тип таблицы type');
      }

      if (!res.ok) {
        throw new Error(res.message);
      }

      toast.success(res.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Иконки управления новостью.
  const icons = [
    {
      id: 0,
      icon: IconEditOld,
      tooltip: 'Редактирование',
      getClick: () => editItem(propsTable.row.original.urlSlug),
    },
    { id: 1, icon: IconDelete, tooltip: 'Удаление', getClick: () => deleteItem(urlSlug) },
  ];

  return (
    <div className={styles.wrapper}>
      {icons.map((icon) => (
        <icon.icon
          getClick={icon.getClick}
          key={icon.id}
          squareSize={20}
          colors={{ hover: '#ec9c07' }}
          tooltip={icon.tooltip}
        />
      ))}
    </div>
  );
}
