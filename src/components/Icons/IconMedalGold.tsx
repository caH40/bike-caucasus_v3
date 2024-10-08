'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconMedalGold({
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
          fill="#F1C40E"
        />
        <path
          d="M12 11.04C8.81879 11.04 6.23999 13.6188 6.23999 16.8C6.23999 19.9812 8.81879 22.56 12 22.56C15.1812 22.56 17.76 19.9812 17.76 16.8C17.76 13.6188 15.1812 11.04 12 11.04ZM12 22.08C9.08423 22.08 6.71999 19.716 6.71999 16.8C6.71999 13.8845 9.08423 11.52 12 11.52C14.916 11.52 17.28 13.8845 17.28 16.8C17.28 19.716 14.916 22.08 12 22.08Z"
          fill="#CAA50C"
        />
        <path
          d="M13.0957 13.5V20.5H11.6895V15.0929L10 15.6206V14.5315L12.9443 13.5H13.0957Z"
          fill="#927500"
        />
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
