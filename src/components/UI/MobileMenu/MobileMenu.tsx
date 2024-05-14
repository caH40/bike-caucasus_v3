'use client';

import { useEffect } from 'react';
import cn from 'classnames/bind';

import styles from './MobileMenu.module.css';
import { useMobileMenuStore } from '@/store/mobile';

const cx = cn.bind(styles);

/**
 * Мобильно меню (шторка)
 */
export default function MobileMenu() {
  const isMenuOpen = useMobileMenuStore((state) => state.isMenuOpen);
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('fixed');
    } else {
      document.body.classList.remove('fixed');
    }
  }, [isMenuOpen]);

  return <div className={cx('wrapper', { open: isMenuOpen })}>MobileMenu</div>;
}
