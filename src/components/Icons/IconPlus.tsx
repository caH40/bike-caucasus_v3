'use client';

import cn from 'classnames/bind';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';
import { Tooltip } from 'react-tooltip';

const cx = cn.bind(styles);

export default function IconPlus({
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
      style={style}
      id={tooltip?.id}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="3" />
        <line
          x1="11.8995"
          y1="4.89954"
          x2="11.8995"
          y2="18.8995"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="4.89951"
          y1="11.8995"
          x2="18.8995"
          y2="11.8995"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
