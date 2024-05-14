'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';

import { useResize } from '@/hooks/resize';
import { navLinksDesktop } from '@/constants/navigation';
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
          {navLinksDesktop.map((link) => (
            <li className={styles.item} key={link.id}>
              <Link
                className={cx('link', { active: isActivePage(link.href) })}
                href={link.href}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
