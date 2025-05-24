'use client';

import Link from 'next/link';

import { legalLinks } from '@/constants/navigation';
import styles from './NavBarFooter.module.css';

/**
 * Компонент для отображения футера навигационной панели с проверкой разрешений на доступ к ссылкам.
 */
export default function NavBarFooterPolice() {
  return (
    <>
      <h4 className={styles.title}>Документы:</h4>
      <ul className={styles.list}>
        {legalLinks.map((link) => (
          <li className={styles.item} key={link.id}>
            <Link className={styles.link} href={link.href}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
