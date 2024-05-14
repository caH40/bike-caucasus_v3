'use client';

import { useEffect } from 'react';
import cn from 'classnames/bind';

import styles from './MobileMenu.module.css';
import { useMobileMenuStore } from '@/store/mobile';
import { navLinksFull } from '@/constants/navigation';
import Link from 'next/link';
import Login from '../ButtonLogin/ButtonLogin';

const cx = cn.bind(styles);

/**
 * Мобильно меню (шторка)
 */
export default function MobileMenu() {
  const isMenuOpen = useMobileMenuStore((state) => state.isMenuOpen);
  const setMobileMenu = useMobileMenuStore((state) => state.setMobileMenu);

  // удаление прокрутки при открытом мобильном меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('fixed');
    } else {
      document.body.classList.remove('fixed');
    }
  }, [isMenuOpen]);

  return (
    <div className={cx('wrapper', { open: isMenuOpen })}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          {navLinksFull.map((link) => (
            <li key={link.id} onClick={() => setMobileMenu(false)}>
              <Link href={link.href} className={styles.link}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <Login />
      </nav>
    </div>
  );
}
