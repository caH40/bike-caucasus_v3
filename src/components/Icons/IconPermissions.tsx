'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);
const id = 'IconDelete';

export default function IconPermissions({
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
        <path
          d="M10 12C12.7614 12 15 9.76142 15 7C15 4.23858 12.7614 2 10 2C7.23858 2 5 4.23858 5 7C5 9.76142 7.23858 12 10 12Z"
          fill="currentColor"
        />
        <path
          d="M11.4501 21.9541C12.362 21.9541 11.8646 21.2655 11.8646 21.2655C10.9495 20.0029 10.4522 18.4314 10.4554 16.8123C10.451 15.7975 10.6491 14.7942 11.0356 13.8742C11.0531 13.8216 11.0815 13.7744 11.1185 13.7364C11.4087 13.0937 10.8284 13.0478 10.8284 13.0478C10.5674 13.0096 10.3041 12.9943 10.0409 13.0019C8.08948 13.0103 6.20537 13.793 4.73019 15.2079C3.25501 16.6229 2.28641 18.5765 2 20.7146C2 21.1736 2.12434 22 3.40923 22H11.3258C11.4087 21.9541 11.4087 21.9541 11.4501 21.9541Z"
          fill="currentColor"
        />
        <path
          d="M18 17V16.449C18 15.9068 17.8782 15.4654 17.7312 15.1955C17.6698 15.0826 17.6218 15.0262 17.5941 15H16.4059C16.3782 15.0262 16.3302 15.0826 16.2688 15.1955C16.1218 15.4654 16 15.9068 16 16.449V17H18Z"
          fill="currentColor"
        />
        <path
          d="M17.5675 14.9799C17.5675 14.9799 17.5708 14.9809 17.5769 14.9854C17.5704 14.9826 17.5675 14.9799 17.5675 14.9799Z"
          fill="currentColor"
        />
        <path
          d="M16.4231 14.9854C16.4292 14.9809 16.4325 14.9799 16.4325 14.9799C16.4325 14.9799 16.4296 14.9826 16.4231 14.9854Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22 17C22 19.7614 19.7614 22 17 22C14.2386 22 12 19.7614 12 17C12 14.2386 14.2386 12 17 12C19.7614 12 22 14.2386 22 17ZM20 17V20H14V17H15V16.449C15 15.0964 15.597 14 16.3333 14H17.6667C18.403 14 19 15.0964 19 16.449V17H20Z"
          fill="currentColor"
        />
      </svg>

      <Tooltip anchorSelect={`#${id}`} place="top" className={cx('tooltip')}>
        {tooltip}
      </Tooltip>
    </div>
  );
}
