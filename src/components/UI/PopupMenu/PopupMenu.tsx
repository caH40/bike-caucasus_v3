'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import styles from './PopupMenu.module.css';
import { getNavLinksUserPopup } from '@/constants/navigation';
import { usePopupUserStore } from '@/store/popup-user';

export default function PopupMenu() {
  const { data: session, status } = useSession();
  const { isVisible, setMenu } = usePopupUserStore();

  return (
    isVisible && (
      <div className={styles.wrapper} onClick={() => setMenu(false)}>
        <div className={styles.popup}>
          <ul className={styles.list}>
            {status === 'authenticated' &&
              getNavLinksUserPopup(session?.user.id).map((nav) => (
                <li className={styles.item} key={nav.id}>
                  <Link href={nav.href} className={styles.link}>
                    {nav.icon && <nav.icon squareSize={22} />}

                    {nav.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    )
  );
}
