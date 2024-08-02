'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { usePopupUserStore } from '@/store/popup-user';
import { TMenuPopup } from '@/types/index.interface';
import PermissionCheck from '@/hoc/permission-check';
import styles from './PopupMenu.module.css';

type Props = {
  // eslint-disable-next-line no-unused-vars
  navLinks: (userId: string | undefined) => TMenuPopup[];
};

/**
 * Popup меню у профиля пользователя.
 */
export default function PopupMenu({ navLinks }: Props) {
  const { data: session } = useSession();
  const { isVisible, setMenu } = usePopupUserStore();

  return (
    isVisible && (
      <div
        className={styles.popup}
        onClick={() => setMenu(false)}
        onMouseLeave={() => setMenu(false)}
      >
        <ul className={styles.list}>
          {navLinks(session?.user.id).map((link) => (
            <PermissionCheck permission={link.permission} key={link.id}>
              <li className={styles.item} key={link.id}>
                <Link href={link.href} className={styles.link}>
                  {link.icon && <link.icon squareSize={22} />}

                  {link.name}
                </Link>
              </li>
            </PermissionCheck>
          ))}
        </ul>
      </div>
    )
  );
}
