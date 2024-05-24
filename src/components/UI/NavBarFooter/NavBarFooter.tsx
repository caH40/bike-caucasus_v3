'use client';

import Link from 'next/link';

import PermissionCheck from '@/hoc/permission-check';
import { navLinksFull } from '@/constants/navigation';
import styles from './NavBarFooter.module.css';

type Props = {};

/**
 * Компонент для отображения футера навигационной панели с проверкой разрешений на доступ к ссылкам.
 * @returns {JSX.Element} - JSX элемент, содержащий карту сайта с проверкой разрешений.
 */
export default function NavBarFooter({}: Props) {
  return (
    <>
      <h4 className={styles.title}>Карта сайта:</h4>
      <ul className={styles.list}>
        {navLinksFull.map((link) => (
          <PermissionCheck permission={link.permission} key={link.id}>
            <li className={styles.item}>
              <Link className={styles.link} href={link.href}>
                {link.name}
              </Link>
            </li>
          </PermissionCheck>
        ))}
      </ul>
    </>
  );
}
