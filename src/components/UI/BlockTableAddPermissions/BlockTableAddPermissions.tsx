import { CellContext } from '@tanstack/react-table';

import { TPermissionDto } from '@/types/dto.types';
import styles from './BlockTableAddPermissions.module.css';
import IconPlus from '@/components/Icons/IconPlus';
import { usePermissionTable } from '@/store/permission-table';
import IconDelete from '@/components/Icons/IconDelete';

/**
 * Блок для добавления Разрешений в Роли.
 */
export default function BlockTableAddPermissions({
  propsTable,
  isAddBlock,
}: {
  propsTable: CellContext<TPermissionDto & { index: number }, unknown>;
  isAddBlock: boolean;
}): JSX.Element {
  const addPermissionName = usePermissionTable((state) => state.addPermission);
  const removePermissionName = usePermissionTable((state) => state.removePermission);
  const name = propsTable.row.original.name;

  // Иконки управления Разрешениями.
  const iconsForBlockAdd = [
    {
      id: 0,
      icon: IconPlus,
      tooltip: 'Добавить',
      getClick: () => addPermissionName(name),
      colors: { default: 'green', hover: '#ec9c07' },
    },
  ];
  // Иконки управления Разрешениями.
  const iconsForBlockRemove = [
    {
      id: 0,
      icon: IconDelete,
      tooltip: 'Удалить',
      getClick: () => removePermissionName(name),
      colors: { default: 'red', hover: '#ec9c07' },
    },
  ];

  return (
    <div className={styles.wrapper}>
      {(isAddBlock ? iconsForBlockAdd : iconsForBlockRemove).map((icon, index) => (
        <icon.icon
          getClick={icon.getClick}
          key={icon.id}
          squareSize={20}
          colors={icon.colors}
          tooltip={{ text: icon.tooltip, id: `blockTableControlAdmin${index}` }}
        />
      ))}
    </div>
  );
}
