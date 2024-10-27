'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';

import PopupMenu from '../PopupMenu/PopupMenu';
import PermissionCheck from '@/hoc/permission-check';
import { useResize } from '@/hooks/resize';
import { navLinksFull } from '@/constants/navigation';
import styles from './Navbar.module.css';

const cx = classNames.bind(styles);

/**
 * Главное навигационное меню в шапке страницы в десктопном варианте.
 */
const Navbar = () => {
  const { isScreenLg: lg } = useResize();
  const [activePopupId, setActivePopupId] = useState<number | null>(null);

  const pathname = usePathname();
  const isActivePage = (href: string) => {
    if (pathname === '/' && pathname === href) {
      return true;
    }
    if (href !== '/') {
      return pathname.startsWith(href);
    }
    return false;
  };

  return (
    <nav className={styles.nav}>
      {lg && (
        <ul className={styles.list}>
          {navLinksFull.map((link) =>
            link.popupMenu ? (
              <PermissionCheck permission={link.permission} key={link.id}>
                <li className={styles.item}>
                  <span
                    className={cx('link', 'item__popup', { active: isActivePage(link.href) })}
                    onClick={() => setActivePopupId(link.id)}
                  >
                    {link.name}
                  </span>

                  {/* Попап меню в текущей кнопке навигации */}
                  {activePopupId === link.id && (
                    <div
                      className={styles.block__popup}
                      onClick={() => setActivePopupId(null)}
                      onMouseLeave={() => setActivePopupId(null)}
                    >
                      <PopupMenu navLinks={link.popupMenu} />
                    </div>
                  )}
                </li>
              </PermissionCheck>
            ) : (
              <PermissionCheck permission={link.permission} key={link.id}>
                <li className={styles.item}>
                  <Link
                    className={cx('link', { active: isActivePage(link.href) })}
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                </li>
              </PermissionCheck>
            )
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
