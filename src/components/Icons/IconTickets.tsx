'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconTickets({
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
        <g clipPath="url(#clip0_1332_95)">
          <path
            d="M1.2373 14.3701C1.28866 14.7016 1.41971 15.0009 1.60645 15.2529L1.56543 16.2197C1.54146 16.7714 1.96888 17.2386 2.52051 17.2627L21.2334 18.0752C21.785 18.0991 22.2522 17.6717 22.2764 17.1201L22.4521 13.0605C22.9084 12.8826 23.273 12.5463 23.4932 12.127L23.2754 17.1631L23.2559 17.3662C23.1196 18.3027 22.3393 19.0177 21.3945 19.0723L21.1904 19.0742L2.47754 18.2617C1.44288 18.2168 0.626766 17.393 0.568359 16.3809L0.566406 16.1768L0.774414 11.3799L1.2373 14.3701Z"
            fill="currentColor"
          />
          <rect
            x="0.432204"
            y="5.89313"
            width="21.7303"
            height="10"
            rx="1.5"
            transform="rotate(-8.79501 0.432204 5.89313)"
            stroke="currentColor"
          />
          <rect
            x="3.54585"
            y="7.43513"
            width="3.73548"
            height="5"
            rx="1.5"
            transform="rotate(-8.79501 3.54585 7.43513)"
            stroke="currentColor"
          />
          <path
            d="M10.6159 6.84729L19.0395 5.54399"
            stroke="currentColor"
            strokeLinecap="round"
          />
          <path
            d="M11.2275 10.8003L18.7152 9.64181"
            stroke="currentColor"
            strokeLinecap="round"
          />
          <path
            d="M10.9217 8.82385L15.6015 8.0998"
            stroke="currentColor"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
