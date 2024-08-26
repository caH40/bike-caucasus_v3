'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconTelegram({
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
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1140_97)">
          <circle cx="10" cy="10" r="9.5" stroke="white" />
          <path
            d="M14.5414 6.03561L12.8744 14.4405C12.8744 14.4405 12.6413 15.0234 12.0001 14.7436L8.15316 11.7943L6.75433 11.1182L4.39956 10.3254C4.39956 10.3254 4.03818 10.1973 4.00318 9.91748C3.96826 9.63769 4.41122 9.48617 4.41122 9.48617L13.772 5.81409C13.772 5.81409 14.5414 5.47605 14.5414 6.03561Z"
            fill="currentColor"
          />
          <path
            d="M7.85755 14.3459C7.85755 14.3459 7.74526 14.3354 7.60533 13.8924C7.46548 13.4494 6.75439 11.118 6.75439 11.118L12.4081 7.52754C12.4081 7.52754 12.7346 7.32935 12.7229 7.52754C12.7229 7.52754 12.7812 7.56246 12.6063 7.72565C12.4315 7.88891 8.16489 11.7241 8.16489 11.7241"
            fill="#BBBBBB"
          />
          <path
            d="M9.62813 12.9255L8.10651 14.3128C8.10651 14.3128 7.98758 14.4031 7.85742 14.3465L8.1488 11.7695"
            fill="#BBBBBB"
          />
        </g>
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
