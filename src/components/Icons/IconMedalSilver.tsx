'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconMedalSilver({
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
        <path d="M8.39998 0H1.91998L9.11998 14.4H15.6L8.39998 0Z" fill="#2A7726" />
        <path d="M15.6 0H22.08L14.88 14.4H8.40002L15.6 0Z" fill="#318D2C" />
        <path
          d="M12 9.6001C15.9763 9.6001 19.2 12.8243 19.2 16.8001C19.2 20.7764 15.9763 24.0001 12 24.0001C8.02391 24.0001 4.79999 20.7764 4.79999 16.8001C4.79999 12.8238 8.02343 9.6001 12 9.6001Z"
          fill="#C0C0C0"
        />
        <path
          d="M12 11.04C8.81879 11.04 6.23999 13.6188 6.23999 16.8C6.23999 19.9812 8.81879 22.56 12 22.56C15.1812 22.56 17.76 19.9812 17.76 16.8C17.76 13.6188 15.1812 11.04 12 11.04ZM12 22.08C9.08423 22.08 6.71999 19.716 6.71999 16.8C6.71999 13.8845 9.08423 11.52 12 11.52C14.916 11.52 17.28 13.8845 17.28 16.8C17.28 19.716 14.916 22.08 12 22.08Z"
          fill="#939393"
        />
        <path
          d="M14.5 19.4336V20.5H9.64146V19.59L11.939 17.1967C12.1699 16.9471 12.352 16.7275 12.4854 16.5379C12.6187 16.3452 12.7146 16.173 12.7732 16.0213C12.835 15.8665 12.8659 15.7196 12.8659 15.5806C12.8659 15.372 12.8301 15.1935 12.7585 15.045C12.687 14.8934 12.5813 14.7765 12.4415 14.6943C12.3049 14.6122 12.1358 14.5711 11.9341 14.5711C11.7195 14.5711 11.5341 14.6216 11.378 14.7227C11.2252 14.8239 11.1081 14.9645 11.0268 15.1445C10.9488 15.3246 10.9098 15.5284 10.9098 15.7559H9.5C9.5 15.3452 9.60081 14.9692 9.80244 14.628C10.0041 14.2836 10.2886 14.0103 10.6561 13.8081C11.0236 13.6027 11.4593 13.5 11.9634 13.5C12.461 13.5 12.8805 13.579 13.222 13.737C13.5667 13.8918 13.8268 14.1161 14.0024 14.41C14.1813 14.7006 14.2707 15.0482 14.2707 15.4526C14.2707 15.6801 14.2333 15.9028 14.1585 16.1209C14.0837 16.3357 13.9764 16.5506 13.8366 16.7654C13.7 16.9771 13.5341 17.1919 13.339 17.41C13.1439 17.628 12.9276 17.8539 12.6902 18.0877L11.4561 19.4336H14.5Z"
          fill="#838383"
        />
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
