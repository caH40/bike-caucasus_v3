'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconParamsHight({
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
        <line x1="2" y1="2.5" x2="22" y2="2.5" stroke="currentColor" strokeWidth="3" />
        <path
          d="M12.7071 6.29289C12.3166 5.90237 11.6834 5.90237 11.2929 6.29289L4.92893 12.6569C4.53841 13.0474 4.53841 13.6805 4.92893 14.0711C5.31946 14.4616 5.95262 14.4616 6.34315 14.0711L12 8.41421L17.6569 14.0711C18.0474 14.4616 18.6805 14.4616 19.0711 14.0711C19.4616 13.6805 19.4616 13.0474 19.0711 12.6569L12.7071 6.29289ZM12 23H13V7H12H11L11 23H12Z"
          fill="currentColor"
        />
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
