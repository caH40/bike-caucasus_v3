'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconPdf({
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
        <path
          d="M6 0C5.175 0 4.5 0.675 4.5 1.5V22.5C4.5 23.325 5.175 24 6 24H21C21.825 24 22.5 23.325 22.5 22.5V6L16.5 0H6Z"
          fill="#E2E5E7"
        />
        <path d="M18 6H22.5L16.5 0V4.5C16.5 5.325 17.175 6 18 6Z" fill="#B0B7BD" />
        <path d="M22.5 10.5L18 6H22.5V10.5Z" fill="#CAD1D8" />
        <path
          d="M19.5 19.5C19.5 19.9125 19.1625 20.25 18.75 20.25H2.25C1.8375 20.25 1.5 19.9125 1.5 19.5V12C1.5 11.5875 1.8375 11.25 2.25 11.25H18.75C19.1625 11.25 19.5 11.5875 19.5 12V19.5Z"
          fill="#F15642"
        />
        <path
          d="M4.76923 14.2104C4.76923 14.0124 4.92523 13.7964 5.17648 13.7964H6.56173C7.34173 13.7964 8.04373 14.3184 8.04373 15.3189C8.04373 16.2669 7.34173 16.7949 6.56173 16.7949H5.56048V17.5869C5.56048 17.8509 5.39248 18.0001 5.17648 18.0001C4.97848 18.0001 4.76923 17.8509 4.76923 17.5869V14.2104ZM5.56048 14.5516V16.0456H6.56173C6.96373 16.0456 7.28173 15.6909 7.28173 15.3189C7.28173 14.8996 6.96373 14.5516 6.56173 14.5516H5.56048Z"
          fill="white"
        />
        <path
          d="M9.2182 18.0003C9.0202 18.0003 8.8042 17.8923 8.8042 17.6291V14.2226C8.8042 14.0073 9.0202 13.8506 9.2182 13.8506H10.5914C13.3319 13.8506 13.2719 18.0003 10.6454 18.0003H9.2182ZM9.5962 14.5826V17.2691H10.5914C12.2107 17.2691 12.2827 14.5826 10.5914 14.5826H9.5962Z"
          fill="white"
        />
        <path
          d="M14.244 14.6304V15.5836H15.7732C15.9892 15.5836 16.2052 15.7996 16.2052 16.0089C16.2052 16.2069 15.9892 16.3689 15.7732 16.3689H14.244V17.6281C14.244 17.8381 14.0947 17.9994 13.8847 17.9994C13.6207 17.9994 13.4595 17.8381 13.4595 17.6281V14.2216C13.4595 14.0064 13.6215 13.8496 13.8847 13.8496H15.99C16.254 13.8496 16.41 14.0064 16.41 14.2216C16.41 14.4136 16.254 14.6296 15.99 14.6296H14.244V14.6304Z"
          fill="white"
        />
        <path
          d="M18.75 20.25H4.5V21H18.75C19.1625 21 19.5 20.6625 19.5 20.25V19.5C19.5 19.9125 19.1625 20.25 18.75 20.25Z"
          fill="#CAD1D8"
        />
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
