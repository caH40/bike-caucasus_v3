'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconParamsLow({
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
        <line x1="22" y1="21.5" x2="2" y2="21.5" stroke="currentColor" strokeWidth="3" />
        <path
          d="M11.2929 17.7071C11.6834 18.0976 12.3166 18.0976 12.7071 17.7071L19.0711 11.3431C19.4616 10.9526 19.4616 10.3195 19.0711 9.92893C18.6805 9.53841 18.0474 9.53841 17.6569 9.92893L12 15.5858L6.34315 9.92893C5.95262 9.53841 5.31946 9.53841 4.92893 9.92893C4.53841 10.3195 4.53841 10.9526 4.92893 11.3431L11.2929 17.7071ZM12 1L11 1V17H12H13L13 1H12Z"
          fill="currentColor"
        />
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
