'use client';

import useHasAccess from '@/hooks/useHasAccess';

type Props = {
  permission: string | null;
  children: React.ReactNode;
};

/**
 * Компонент, проверяющий наличие доступа и отображающий дочерние элементы, если доступ разрешен.
 * @param {Object} props - Объект с параметрами.
 * @param {string | null} props.permission - Требуемое разрешение.
 * @param {React.ReactNode} props.children - Дочерние элементы, отображаемые при наличии доступа.
 * @returns {JSX.Element | null} - JSX элемент с дочерними элементами или null, если доступ запрещен.
 */
export default function PermissionCheck({ permission, children }: Props): JSX.Element | null {
  const hasAccess = useHasAccess(permission);

  return hasAccess ? <>{children}</> : null;
}
