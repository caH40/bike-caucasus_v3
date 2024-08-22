'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import { generateIdFromFilename } from '@/libs/utils/ids';
import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);
const id = generateIdFromFilename(new URL(import.meta.url).pathname);

export default function IconRegistration({
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22 17C22 19.7614 19.7614 22 17 22C14.2386 22 12 19.7614 12 17C12 14.2386 14.2386 12 17 12C19.7614 12 22 14.2386 22 17ZM16 18H13V16H16V13H18V16H21V18H18V21H16V18Z"
          fill="currentColor"
        />
      </svg>

      <Tooltip anchorSelect={`#${id}`} place="top" className={cx('tooltip')}>
        {tooltip}
      </Tooltip>
    </div>
  );
}
