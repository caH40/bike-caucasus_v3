'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconDate({
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
        <g clipPath="url(#clip0_453_125)">
          <path
            d="M3.5 6C3.5 5.17539 4.17229 4.5 5 4.5H11H13H19C19.828 4.5 20.5 5.17533 20.5 6V20C20.5 20.8247 19.828 21.5 19 21.5H13H11H5C4.17229 21.5 3.5 20.8246 3.5 20V6Z"
            stroke="currentColor"
          />
          <path
            d="M5 3C3.8954 3 3 3.8954 3 5V8V9H21V8V5C21 3.8954 20.105 3 19 3H13H11H5Z"
            fill="currentColor"
          />
          <path
            d="M7.5 5.5C7.5 5.69698 7.4612 5.89204 7.38582 6.07403C7.31044 6.25601 7.19995 6.42137 7.06066 6.56066C6.92137 6.69995 6.75601 6.81044 6.57403 6.88582C6.39204 6.9612 6.19698 7 6 7C5.80302 7 5.60796 6.9612 5.42597 6.88582C5.24399 6.81044 5.07863 6.69995 4.93934 6.56066C4.80005 6.42137 4.68956 6.25601 4.61418 6.07403C4.5388 5.89204 4.5 5.69698 4.5 5.5C4.5 5.30302 4.5388 5.10796 4.61418 4.92597C4.68956 4.74399 4.80005 4.57863 4.93934 4.43934C5.07863 4.30005 5.24399 4.18956 5.42597 4.11418C5.60796 4.0388 5.80302 4 6 4C6.19698 4 6.39204 4.0388 6.57403 4.11418C6.75601 4.18956 6.92137 4.30005 7.06066 4.43934C7.19995 4.57863 7.31044 4.74399 7.38582 4.92597C7.4612 5.10796 7.5 5.30302 7.5 5.5Z"
            fill="currentColor"
          />
          <path
            d="M19.5 5.5C19.5 5.69698 19.4612 5.89204 19.3858 6.07403C19.3104 6.25601 19.1999 6.42137 19.0607 6.56066C18.9214 6.69995 18.756 6.81044 18.574 6.88582C18.392 6.9612 18.197 7 18 7C17.803 7 17.608 6.9612 17.426 6.88582C17.244 6.81044 17.0786 6.69995 16.9393 6.56066C16.8001 6.42137 16.6896 6.25601 16.6142 6.07403C16.5388 5.89204 16.5 5.69698 16.5 5.5C16.5 5.30302 16.5388 5.10796 16.6142 4.92597C16.6896 4.74399 16.8001 4.57863 16.9393 4.43934C17.0786 4.30005 17.244 4.18956 17.426 4.11418C17.608 4.0388 17.803 4 18 4C18.197 4 18.392 4.0388 18.574 4.11418C18.756 4.18956 18.9214 4.30005 19.0607 4.43934C19.1999 4.57863 19.3104 4.74399 19.3858 4.92597C19.4612 5.10796 19.5 5.30302 19.5 5.5Z"
            fill="currentColor"
          />
          <path
            d="M5 11V13H7V11H5ZM8 11V13H10V11H8ZM11 11V13H13V11H11ZM14 11V13H16V11H14ZM17 11V13H19V11H17Z"
            fill="currentColor"
          />
          <path
            d="M5 14V16H7V14H5ZM8 14V16H10V14H8ZM11 14V16H13V14H11ZM14 14V16H16V14H14ZM17 14V16H19V14H17Z"
            fill="currentColor"
          />
          <path
            d="M5 17V19H7V17H5ZM8 17V19H10V17H8ZM11 17V19H13V17H11ZM14 17V19H16V17H14ZM17 17V19H19V17H17Z"
            fill="currentColor"
          />
          <path
            d="M23.5414 18.4418C23.5414 19.779 23.0102 21.0613 22.0647 22.0068C21.1192 22.9523 19.8368 23.4835 18.4997 23.4835C17.1625 23.4835 15.8802 22.9523 14.9347 22.0068C13.9892 21.0613 13.458 19.779 13.458 18.4418C13.458 17.1047 13.9892 15.8223 14.9347 14.8768C15.8802 13.9313 17.1625 13.4001 18.4997 13.4001C19.8368 13.4001 21.1192 13.9313 22.0647 14.8768C23.0102 15.8223 23.5414 17.1047 23.5414 18.4418Z"
            fill="currentColor"
          />
          <path
            d="M18.5 13.4001C15.462 13.4001 13 15.9001 13 18.9001H13.917C13.917 16.4001 15.969 14.3 18.5 14.3C21.031 14.3 23.083 16.4001 23.083 18.9001H24C24 15.9001 21.538 13.4001 18.5 13.4001Z"
            fill="currentColor"
          />
          <path
            d="M18.958 18V18.9H19.417H22.167C22.42 18.9 22.625 18.7 22.625 18.5C22.625 18.2 22.42 18 22.167 18H19.417H18.958Z"
            fill="#BDC3C7"
          />
          <path
            d="M18.5 15.2998C18.247 15.2998 18.042 15.4998 18.042 15.6998V17.4999V17.9999H18.958V17.4999V15.6998C18.958 15.4998 18.753 15.2998 18.5 15.2998Z"
            fill="#BDC3C7"
          />
          <path
            d="M18.03 18.6425L15.7614 20.9111L16.0855 21.2352L18.3541 18.9666L18.03 18.6425Z"
            fill="#C0392B"
          />
          <path
            d="M18.5 17.5C17.994 17.5 17.583 18 17.583 18.5C17.583 19 17.994 19.4 18.5 19.4C19.006 19.4 19.417 19 19.417 18.5C19.417 18 19.006 17.5 18.5 17.5ZM18.5 18C18.753 18 18.958 18.2 18.958 18.5C18.958 18.7 18.753 18.9 18.5 18.9C18.247 18.9 18.042 18.7 18.042 18.5C18.042 18.2 18.247 18 18.5 18Z"
            fill="#BDC3C7"
          />
          <path
            d="M18.5 13C15.462 13 13 15.4 13 18.5C13 21.5 15.462 24 18.5 24C21.538 24 24 21.5 24 18.5C24 15.4 21.538 13 18.5 13ZM18.5 13.9C21.031 13.9 23.083 15.9 23.083 18.5C23.083 21 21.031 23 18.5 23C15.969 23 13.917 21 13.917 18.5C13.917 15.9 15.969 13.9 18.5 13.9Z"
            fill="black"
          />
          <path
            d="M18.9583 18.5001C18.9583 18.6216 18.91 18.7382 18.824 18.8242C18.7381 18.9101 18.6215 18.9584 18.5 18.9584C18.3784 18.9584 18.2618 18.9101 18.1759 18.8242C18.0899 18.7382 18.0416 18.6216 18.0416 18.5001C18.0416 18.3785 18.0899 18.2619 18.1759 18.176C18.2618 18.09 18.3784 18.0417 18.5 18.0417C18.6215 18.0417 18.7381 18.09 18.824 18.176C18.91 18.2619 18.9583 18.3785 18.9583 18.5001Z"
            fill="#2C3E50"
          />
          <path
            d="M19.293 18C19.371 18.1 19.422 18.3 19.422 18.5C19.422 18.6 19.371 18.8 19.293 18.9H19.422H19.794C19.846 18.8 19.88 18.6 19.88 18.5C19.88 18.3 19.846 18.1 19.794 18H19.422H19.293Z"
            fill="#95A5A6"
          />
          <path
            d="M6 1C5.4477 1 5 1.4477 5 2V5C5 5.5523 5.4477 6 6 6C6.5523 6 7 5.5523 7 5V2C7 1.4477 6.5523 1 6 1ZM18 1C17.448 1 17 1.4477 17 2V5C17 5.5523 17.448 6 18 6C18.552 6 19 5.5523 19 5V2C19 1.4477 18.552 1 18 1Z"
            fill="#95A5A6"
          />
          <path
            d="M6 1C5.4477 1 5 1.4 5 2V4H7V2C7 1.4 6.5523 1 6 1ZM18 1C17.448 1 17 1.4 17 2V4H19V2C19 1.4 18.552 1 18 1Z"
            fill="#BDC3C7"
          />
        </g>
        <defs>
          <clipPath id="clip0_453_125">
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
