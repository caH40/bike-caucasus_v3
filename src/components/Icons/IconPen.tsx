'use client';

import cn from 'classnames/bind';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconPen({
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
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_569_496)">
          <path
            d="M14.0023 12.958V14.008L5.58926 14.0015L6.76651 12.958H14.0023Z"
            fill="currentColor"
          />
          <path
            d="M12.1133 2.02979C12.5258 2.02979 12.7398 2.06204 13.3015 2.53254C13.875 3.01304 13.9783 3.38754 14.0023 3.80454C14.0278 4.25329 13.8763 4.79828 13.4553 5.22478L5.46501 13.215C5.33501 13.3338 5.30751 13.3273 5.22076 13.3533L2.66426 13.9923C2.29626 14.067 1.95076 13.73 2.02676 13.355L2.66601 10.7985C2.69101 10.715 2.69926 10.6693 2.80426 10.5543C5.47826 7.88028 8.10301 5.15603 10.8268 2.53254C11.182 2.19879 11.701 2.02979 12.1133 2.02979ZM12.1133 3.06554C11.8983 3.06954 11.6888 3.15828 11.5355 3.30953L3.65051 11.1948L3.25901 12.76L4.82451 12.3688C7.46051 9.73278 10.1793 7.17678 12.732 4.46028C13.1505 4.00403 12.843 3.09703 12.1555 3.06603C12.1415 3.06553 12.1275 3.06529 12.1133 3.06554Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}
