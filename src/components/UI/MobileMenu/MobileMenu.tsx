'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cn from 'classnames/bind';

import { useMobileMenuStore } from '@/store/mobile';
import { navLinksFull } from '@/constants/navigation';
import PermissionCheck from '@/hoc/permission-check';
import Login from '../ButtonLogin/ButtonLogin';
import styles from './MobileMenu.module.css';

const cx = cn.bind(styles);

/**
 * Мобильно меню (шторка)
 */
export default function MobileMenu() {
  const isMenuOpen = useMobileMenuStore((state) => state.isMenuOpen);
  const setMobileMenu = useMobileMenuStore((state) => state.setMobileMenu);
  const path = usePathname();
  // !! добавить если будут использоваться query search параметры в url, на странице перехода
  // const searchParams = useSearchParams();

  // удаление прокрутки при открытом мобильном меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('fixed');
    } else {
      document.body.classList.remove('fixed');
    }
  }, [isMenuOpen]);

  // закрытие меню при изменении маршрута (открытии новой страницы)
  useEffect(() => {
    return () => {
      setMobileMenu(false);
    };
  }, [path, setMobileMenu]);

  return (
    <div className={cx('wrapper', { open: isMenuOpen })}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          {navLinksFull.map((link) => (
            <PermissionCheck permission={link.permission} key={link.id}>
              <li key={link.id}>
                <Link href={link.href} className={styles.link}>
                  {link.name}
                </Link>
              </li>
            </PermissionCheck>
          ))}
        </ul>

        <Login />
      </nav>
    </div>
  );
}
