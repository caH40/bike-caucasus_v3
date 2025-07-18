'use client';

import { useSession } from 'next-auth/react';

import { checkPermissionAccess } from '@/libs/utils/checkPermissionAccess';

type Props = {
  permission: string | null;
  children: React.ReactNode;
  moderatorIds?: string[];
};

/**
 * Компонент, проверяющий наличие доступа и отображающий дочерние элементы, если доступ разрешен.
 * @param {Object} props - Объект с параметрами.
 * @param {string | null} props.permission - Требуемое разрешение.
 * @param {string[]} [props.moderatorIds] - Список ID модераторов, которым разрешён доступ к сущности.
 * @param {React.ReactNode} props.children - Дочерние элементы, отображаемые при наличии доступа.
 * @returns {JSX.Element | null} - JSX элемент с дочерними элементами или null, если доступ запрещен.
 */
export default function PermissionCheck({
  permission,
  moderatorIds,
  children,
}: Props): JSX.Element | null {
  const { data: session, status } = useSession();

  // Если загрузка или юзер не авторизован.
  if (status === 'loading' || !session?.user) {
    return null;
  }

  // Доступ согласно Permissions у пользователя.
  const hasPermissionAccess = checkPermissionAccess({ user: session.user, permission });

  const hasModeratorAccess =
    session.user.role.name === 'admin' ||
    !moderatorIds?.length ||
    moderatorIds.includes(session.user.idDB);

  return hasPermissionAccess && hasModeratorAccess ? <>{children}</> : null;
}
