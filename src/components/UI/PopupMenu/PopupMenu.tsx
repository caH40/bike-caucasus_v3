'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import styles from './PopupMenu.module.css';
import { getNavLinksUserPopup } from '@/constants/navigation';
import { usePopupUserStore } from '@/store/popup-user';
import PermissionCheck from '@/hoc/permission-check';

export default function PopupMenu() {
  const { data: session } = useSession();
  const { isVisible, setMenu } = usePopupUserStore();

  return (
    isVisible && (
      <div className={styles.wrapper} onClick={() => setMenu(false)}>
        <div className={styles.popup}>
          <ul className={styles.list}>
            {getNavLinksUserPopup(session?.user.id).map((link) => (
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
      </div>
    )
  );
}
