'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { generateIdFromFilename } from '@/libs/utils/ids';
import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);
const id = generateIdFromFilename(new URL(import.meta.url).pathname);

export default function IconResults({
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
      id={id}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="0.5" width="23" height="23" stroke="currentColor" />
        <line x1="1" y1="5.5" x2="23" y2="5.5" stroke="currentColor" />
        <line x1="1" y1="7.5" x2="23" y2="7.5" stroke="currentColor" />
        <line x1="7" y1="10.5" x2="21" y2="10.5" stroke="currentColor" />
        <line x1="3" y1="10.5" x2="4" y2="10.5" stroke="currentColor" />
        <line x1="7" y1="12.5" x2="21" y2="12.5" stroke="#6996D3" />
        <line x1="3" y1="12.5" x2="4" y2="12.5" stroke="#6996D3" />
        <line x1="7" y1="14.5" x2="21" y2="14.5" stroke="currentColor" />
        <line x1="3" y1="14.5" x2="4" y2="14.5" stroke="currentColor" />
        <line x1="7" y1="16.5" x2="21" y2="16.5" stroke="currentColor" />
        <line x1="3" y1="16.5" x2="4" y2="16.5" stroke="currentColor" />
        <line x1="7" y1="18.5" x2="21" y2="18.5" stroke="currentColor" />
        <line x1="3" y1="18.5" x2="4" y2="18.5" stroke="currentColor" />
        <line x1="7" y1="20.5" x2="21" y2="20.5" stroke="currentColor" />
        <line x1="3" y1="20.5" x2="4" y2="20.5" stroke="currentColor" />
        <rect x="3" y="2" width="2" height="2" fill="currentColor" />
        <rect x="19" y="2" width="2" height="2" fill="currentColor" />
        <rect x="15" y="2" width="2" height="2" fill="currentColor" />
        <rect x="7" y="2" width="2" height="2" fill="#6996D3" />
        <rect x="11" y="2" width="2" height="2" fill="currentColor" />
      </svg>
      <Tooltip anchorSelect={`#${id}`} place="top" className={cx('tooltip')}>
        {tooltip}
      </Tooltip>
    </div>
  );
}
