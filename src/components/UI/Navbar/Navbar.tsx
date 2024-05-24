'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';

import PermissionCheck from '@/hoc/permission-check';
import { useResize } from '@/hooks/resize';
import { navLinksFull } from '@/constants/navigation';
import styles from './Navbar.module.css';

const cx = classNames.bind(styles);

const Navbar = () => {
  const { isScreenLg: lg } = useResize();

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
          {navLinksFull.map((link) => (
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
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
