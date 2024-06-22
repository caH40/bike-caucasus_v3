'use client';

import cn from 'classnames/bind';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconRoute({
  isActive,
  squareSize = 24,
  getClick,
  colors = { default: 'currentColor', active: 'currentColor', hover: 'currentColor' },
}: TIconProps) {
  const style: React.CSSProperties & CSSVariables = {
    width: squareSize,
    height: squareSize,
    '--color-icon-default': colors.default,
    '--color-icon-active': colors.active,
    '--color-icon-hover': colors.hover,
  };
  return (
    <div
      onClick={getClick}
      className={cx('box', {
        interactive: getClick,
        active: isActive,
      })}
      style={{ ...style, width: squareSize, height: squareSize }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.5 4A4.5 4.5 0 004 8.5v.67A3.001 3.001 0 005 15a3 3 0 001-5.83V8.5a2.5 2.5 0 015 0v7a4.5 4.5 0 109 0v-.67a3.001 3.001 0 10-2 0v.67a2.5 2.5 0 01-5 0v-7A4.5 4.5 0 008.5 4zM5 13a1 1 0 100-2 1 1 0 000 2zm15-1a1 1 0 11-2 0 1 1 0 012 0z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );
}
