'use client';

import cn from 'classnames/bind';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconQuestion({
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
      style={style}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" focusable="false">
        <path
          d="M0 8a8 8 0 1 0 16 0A8 8 0 0 0 0 8Zm14 0A6 6 0 1 1 2 8a6 6 0 0 1 12 0ZM5.178 6.096c0-1.656 1.368-2.664 3.096-2.664 1.704 0 2.976 1.008 2.976 2.496v.048c0 1.416-.912 1.992-1.764 2.364l-.216.096c-.288.132-.384.288-.384.636 0 .172-.14.312-.312.312h-.84a.432.432 0 0 1-.432-.432c0-.816.288-1.332 1.044-1.668l.216-.096C9.282 6.864 9.666 6.6 9.666 6c0-.648-.552-1.08-1.392-1.08-.864 0-1.512.432-1.512 1.248 0 .16-.129.288-.288.288h-.936a.36.36 0 0 1-.36-.36Zm2.916 3.792c-.648 0-1.14.468-1.14 1.14 0 .672.492 1.14 1.14 1.14.648 0 1.14-.468 1.14-1.14 0-.672-.492-1.14-1.14-1.14Z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );
}
