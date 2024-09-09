'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconHomePlace({
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
          d="M21.75 13.5H18.375C18.15 13.5 18 13.425 17.85 13.275L12 7.125L6.14999 13.275C5.99999 13.425 5.84999 13.5 5.62499 13.5H2.24999C1.94999 13.5 1.64999 13.35 1.57499 13.05C1.42499 12.75 1.49999 12.45 1.72499 12.225L11.475 1.725C11.775 1.425 12.3 1.425 12.6 1.725L22.35 12.225C22.575 12.45 22.575 12.75 22.5 13.05C22.35 13.35 22.05 13.5 21.75 13.5Z"
          fill="currentColor"
        />
        <path
          d="M18.375 14.9998C17.775 14.9998 17.175 14.7748 16.725 14.3248L12 9.2998L7.275 14.3248C6.825 14.7748 6.225 14.9998 5.625 14.9998H4.5V21.7498C4.5 22.1998 4.8 22.4998 5.25 22.4998H18.75C19.2 22.4998 19.5 22.1998 19.5 21.7498V14.9998H18.375ZM12.45 20.8498C12.3 20.9248 12.15 20.9998 12 20.9998C11.85 20.9998 11.7 20.9248 11.55 20.8498C11.4 20.7748 9 18.8248 9 16.4998C9 14.8498 10.35 13.4998 12 13.4998C13.65 13.4998 15 14.8498 15 16.4998C15 18.8248 12.6 20.7748 12.45 20.8498Z"
          fill="currentColor"
        />
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
