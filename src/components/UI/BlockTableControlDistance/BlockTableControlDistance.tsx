import { useRouter } from 'next/navigation';

import IconEditOld from '@/components/Icons/IconEditOld';
import IconDelete from '@/components/Icons/IconDelete';
import { deleteItem } from './delete';
import styles from './styles.module.css';

/**
 * Блок Модерации таблицы c дистанциями.
 */
export default function BlockTableControlDistance({
  urlSlug,
  name,
}: {
  urlSlug: string;
  name: string;
}): JSX.Element {
  const router = useRouter();

  // Иконки управления Разрешениями.
  const icons = [
    {
      id: 0,
      icon: IconEditOld,
      tooltip: 'Редактирование',
      getClick: () => router.push(`/moderation/distances/edit/${urlSlug}`),
      colors: { default: 'green', hover: '#ec9c07' },
    },
    {
      id: 1,
      icon: IconDelete,
      tooltip: 'Удаление',
      getClick: () => deleteItem({ urlSlug, name, router }),
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
