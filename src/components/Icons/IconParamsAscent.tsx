'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { generateIdFromFilename } from '@/libs/utils/ids';
import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);
const id = generateIdFromFilename(new URL(import.meta.url).pathname);

export default function IconParamsAscent({
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
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.1388 1.87402L7.12059 15.6528L4.78059 13.357C4.78059 13.357 -0.538234 24.7058 0.111178 24.7058H28.1735V24.7023L22.2829 12.1728L20.5482 13.2528L14.1388 1.87402ZM9.90177 13.2723L14.2271 4.88814L18.2594 12.0899L16.5194 13.2723L14.1547 10.9993L9.90177 13.2723Z"
          fill="currentColor"
        />
      </svg>
      <Tooltip anchorSelect={`#${id}`} place="top" className={cx('tooltip')}>
        {tooltip}
      </Tooltip>
    </div>
  );
}
