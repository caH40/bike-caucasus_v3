'use client';

import cn from 'classnames/bind';

import type { TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconDelete({ isActive, squareSize = 24, getClick }: TIconProps) {
  return (
    <div
      onClick={getClick}
      className={cx('box', {
        interactive: getClick,
        active: isActive,
      })}
      style={{ width: squareSize, height: squareSize }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10.5" stroke="#CB0000" strokeWidth="3" />
        <line
          x1="6.94975"
          y1="6.94975"
          x2="16.8492"
          y2="16.8492"
          stroke="#CB0000"
          strokeWidth="2"
        />
        <line
          x1="6.94975"
          y1="16.8493"
          x2="16.8492"
          y2="6.94976"
          stroke="#CB0000"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
