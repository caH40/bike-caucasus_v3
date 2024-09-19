'use client';

import { usePermissionTable } from '@/store/permission-table';
import TablePermissions from '../../TablePermissions/TablePermissions';
import { TPermissionDto } from '@/types/dto.types';

type Props = {
  permissions: TPermissionDto[];
  hiddenColumnHeaders: string[];
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTablePermissionsForForm({
  permissions,
  hiddenColumnHeaders,
}: Props) {
  const permissionsAdded = usePermissionTable((state) => state.permissions);
  // Фильтрация полного Разрешений согласно добавленных разрешений в Роль.
  const permissionsFiltered = permissions.filter((permission) =>
    permissionsAdded.includes(permission.name)
  );

  return (
    <>
      {/* Таблица */}
      <TablePermissions
        permissions={permissionsFiltered}
        docsOnPage={50} // Установленна величина 50, которая в теории не должна быть достигнута.
        hiddenColumnHeaders={hiddenColumnHeaders}
        captionTitle={'Разрешения в Роли'}
      />
    </>
  );
}
