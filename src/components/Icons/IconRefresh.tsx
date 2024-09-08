'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconRefresh({
  isActive,
  squareSize = 24,
  getClick,
  colors = { default: 'currentColor', active: 'currentColor', hover: 'currentColor' },
  tooltip,
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
      id={tooltip?.id}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_341_2)">
          <path
            className={styles.alone__success}
            d="M3.9 8.4C5.25 5.25 8.4 3 12 3C16.5 3 20.1 6.3 20.85 10.5H23.85C23.1 4.65 18.15 0 12 0C7.5 0 3.6 2.4 1.65 6.15L0 4.5V10.5H6L3.9 8.4Z"
            fill="currentColor"
          />
          <path
            className={styles.alone__success}
            d="M24 13.5H17.85L20.1 15.6C18.75 18.75 15.6 21 11.85 21C7.5 21 3.75 17.7 3 13.5H0C0.75 19.35 5.85 24 11.85 24C16.35 24 20.25 21.45 22.35 17.85L24 19.5V13.5Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_341_2">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
