'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconTeam({
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
        <g clipPath="url(#clip0_460_58)">
          <path
            d="M20.4352 13.4775C21.9591 13.4775 23.1947 12.2427 23.1947 10.7188C23.1947 9.1949 21.959 7.95923 20.4352 7.95923C18.9116 7.95923 17.676 9.1949 17.676 10.7188C17.676 12.2427 18.9116 13.4775 20.4352 13.4775Z"
            fill="currentColor"
          />
          <path
            d="M23.9685 16.1367C23.8455 15.3979 23.2348 14.3638 22.7725 13.9018C22.7116 13.8406 22.4394 13.8265 22.3659 13.872C21.8039 14.2177 21.1437 14.4211 20.4352 14.4211C19.7274 14.4211 19.0672 14.2177 18.5051 13.872C18.4313 13.8265 18.1595 13.8406 18.0986 13.9018C17.9693 14.0311 17.8283 14.2031 17.6909 14.4026C18.0628 15.1029 18.3578 15.8468 18.4643 16.4874C18.5707 17.1296 18.5361 17.7376 18.364 18.2918C18.9752 18.5129 19.7081 18.61 20.4351 18.61C22.3314 18.61 24.2721 17.9525 23.9685 16.1367Z"
            fill="currentColor"
          />
          <path
            d="M11.9291 12.3135C14.3988 12.3135 16.4011 10.3112 16.4011 7.84158C16.4011 5.37267 14.3988 3.37036 11.9291 3.37036C9.4598 3.37036 7.45824 5.37267 7.45824 7.84158C7.45824 10.3112 9.45975 12.3135 11.9291 12.3135Z"
            fill="currentColor"
          />
          <path
            d="M15.7157 12.9984C15.6187 12.9018 15.178 12.8771 15.0582 12.9512C14.1466 13.5121 13.0768 13.8405 11.9291 13.8405C10.7822 13.8405 9.7119 13.5121 8.80074 12.9512C8.68098 12.877 8.24031 12.9018 8.14327 12.9984C7.39229 13.7486 6.40252 15.4257 6.2034 16.6213C5.71243 19.5662 8.85812 20.6295 11.9291 20.6295C15.0009 20.6295 18.1465 19.5662 17.6556 16.6213C17.4564 15.4257 16.4667 13.7486 15.7157 12.9984Z"
            fill="currentColor"
          />
          <path
            d="M3.5648 13.4775C5.08833 13.4775 6.32396 12.2427 6.32396 10.7188C6.32396 9.1949 5.08833 7.95923 3.5648 7.95923C2.04085 7.95923 0.805222 9.1949 0.805222 10.7188C0.805222 12.2427 2.04085 13.4775 3.5648 13.4775Z"
            fill="currentColor"
          />
          <path
            d="M5.39504 16.4874C5.50819 15.8146 5.82746 15.0224 6.22773 14.2899C6.11616 14.1375 6.00465 14.0048 5.90171 13.9018C5.84082 13.8406 5.56904 13.8265 5.49521 13.872C4.93313 14.2177 4.2729 14.4211 3.5648 14.4211C2.85662 14.4211 2.19596 14.2177 1.63435 13.872C1.56085 13.8265 1.28832 13.8406 1.22743 13.9018C0.763976 14.3638 0.154835 15.3979 0.0314602 16.1367C-0.271727 17.9525 1.66852 18.6099 3.5648 18.6099C4.24154 18.6099 4.92493 18.5266 5.50819 18.3362C5.3244 17.7706 5.28549 17.1485 5.39504 16.4874Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_460_58">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
