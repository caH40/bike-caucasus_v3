'use client';

import cn from 'classnames/bind';

import { useResize } from '@/hooks/resize';
import styles from './Burger.module.css';
import { useMobileMenuStore } from '@/store/mobile';

const cx = cn.bind(styles);

const Burger = () => {
  const isMenuOpen = useMobileMenuStore((state) => state.isMenuOpen);

  const setMobileMenu = useMobileMenuStore((state) => state.setMobileMenu);
  const { isScreenLg: lg } = useResize();

  const bar = cx('bar', { clicked: isMenuOpen, unClicked: !isMenuOpen });
  return (
    !lg && (
      <>
        <div className={styles.burger} onClick={() => setMobileMenu()}>
          <div className={bar} />
          <div className={bar} />
          <div className={bar} />
        </div>
      </>
    )
  );
};

export default Burger;
