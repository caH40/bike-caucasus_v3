import cn from 'classnames/bind';

import styles from './icons.module.css';
import { CSSVariables, TIconProps } from '@/types/index.interface';

const cx = cn.bind(styles);

export default function IconHandThumbUp({
  isActive,
  squareSize = 24,
  getClick,
  colors = { default: 'currentColor', active: 'currentColor', hover: 'currentColor' },
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
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.5577 21H8.02383H2.73523C2.32902 21 2 20.664 2 20.2492V9.22194C2 8.80715 2.32902 8.47118 2.73523 8.47118H8.02383C8.07897 8.47118 8.13228 8.47775 8.18374 8.48948L12.6043 3.79862C13.022 3.29045 13.6318 3 14.282 3H14.6152C15.8242 3 16.8075 4.00415 16.8075 5.23868V8.47165H20.5577C21.9045 8.47165 23 9.59029 23 10.9656V18.5065C23 19.8809 21.9045 21 20.5577 21ZM7.2886 9.97271H3.47046V19.4985H7.2886V9.97271ZM21.5295 10.9651C21.5295 10.418 21.0935 9.97271 20.5577 9.97271H16.0718C15.6656 9.97271 15.3366 9.63674 15.3366 9.22194V5.23821C15.3366 4.83186 15.0126 4.50106 14.6147 4.50106H14.2816C14.0642 4.50106 13.8602 4.60006 13.7223 4.77274C13.7095 4.78869 13.6961 4.80418 13.6819 4.81919L8.7586 10.0436V19.498H20.5577C21.0935 19.498 21.5295 19.0527 21.5295 18.5056V10.9651Z"
          fill="currentColor"
        />
        <path
          d="M7.2886 9.97271H3.47046V19.4985H7.2886V9.97271Z"
          fill={isActive ? colors.active : 'none'}
        />
        <path
          d="M21.5295 10.9651C21.5295 10.418 21.0935 9.97271 20.5577 9.97271H16.0718C15.6656 9.97271 15.3366 9.63674 15.3366 9.22194V5.23821C15.3366 4.83186 15.0126 4.50106 14.6147 4.50106H14.2816C14.0642 4.50106 13.8602 4.60006 13.7223 4.77274C13.7095 4.78869 13.6961 4.80418 13.6819 4.81919L8.7586 10.0436V19.498H20.5577C21.0935 19.498 21.5295 19.0527 21.5295 18.5056V10.9651Z"
          fill={isActive ? colors.active : 'none'}
        />
      </svg>
    </div>
  );
}
