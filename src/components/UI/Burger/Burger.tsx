'use client';

import { useState } from 'react';
import cn from 'classnames/bind';

import { useResize } from '@/hooks/resize';
import styles from './Burger.module.css';

const cx = cn.bind(styles);

const Burger = () => {
  const [showMenu, setShowMenu] = useState(true);
  const { isScreenLg: lg } = useResize();

  const bar = cx('bar', { clicked: showMenu, unClicked: !showMenu });
  return (
    !lg && (
      <>
        <div className={styles.burger} onClick={() => setShowMenu((prev) => !prev)}>
          <div className={bar} />
          <div className={bar} />
          <div className={bar} />
        </div>
      </>
    )
  );
};

export default Burger;
