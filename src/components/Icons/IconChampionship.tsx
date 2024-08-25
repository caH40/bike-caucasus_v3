'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);
const id = 'IconDelete';

export default function IconChampionship({
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
          d="M19.9416 3.76703C19.6108 3.52769 19.1211 3.31836 18.4349 3.32035C18.4404 3.21301 18.4505 3.09902 18.4505 3C18.4505 2.44766 17.964 2 17.3638 2H6.49605C5.89578 2 5.40928 2.44766 5.40928 3C5.40928 3.09969 5.41943 3.21465 5.4252 3.32332C4.73982 3.32133 4.24894 3.52832 3.9182 3.7673C3.18285 4.29769 2.84739 5.2707 3.06585 6.24737C3.25171 7.07804 3.88526 7.54069 4.61849 8.07636C5.42703 8.66768 6.43339 9.40303 7.43212 10.9627C7.53281 11.121 7.7143 11.2087 7.90015 11.2087C7.99469 11.2087 8.08889 11.1863 8.17617 11.1394C8.26672 11.0904 8.32722 11.0177 8.3729 10.938C9.06338 11.7913 9.85922 12.4507 10.7482 12.7724C10.6065 13.5363 10.2403 14.6597 9.27059 15.1057C8.90253 15.275 8.66998 15.6213 8.66998 16V17C8.0697 17 7.5832 17.4477 7.5832 18V21C7.5832 21.5523 8.0697 22 8.66998 22H15.1906C15.7909 22 16.2774 21.5523 16.2774 21V18C16.2774 17.4477 15.7909 17 15.1906 17V16C15.1906 15.6213 14.958 15.275 14.59 15.1057C13.6206 14.6597 13.254 13.5363 13.1124 12.7724C14.0013 12.4504 14.7976 11.791 15.4881 10.938C15.5334 11.0177 15.5938 11.0904 15.6844 11.1394C15.7713 11.1863 15.8659 11.2087 15.9604 11.2087C16.1463 11.2087 16.3278 11.1207 16.4285 10.9627C17.4272 9.40303 18.4332 8.66768 19.2421 8.07636C19.9753 7.54069 20.6089 7.07769 20.7958 6.24671C21.0128 5.2707 20.6773 4.29738 19.9416 3.76703ZM5.29373 7.29304C4.57935 6.77171 4.2323 6.50003 4.1305 6.04538C4.01894 5.54773 4.11781 4.89339 4.58805 4.55406C4.82642 4.38238 5.15355 4.31804 5.53681 4.33839C5.75272 5.63507 6.2461 7.22671 6.96702 8.6944C6.35223 8.07237 5.77153 7.64237 5.29373 7.29304ZM19.7304 6.04503C19.6275 6.50003 19.2805 6.77171 18.5661 7.29304C18.0883 7.64237 17.5076 8.07237 16.8925 8.69471C17.6137 7.2264 18.1071 5.63472 18.323 4.33773C18.7066 4.31773 19.0334 4.38273 19.2718 4.55441C19.7423 4.89371 19.8409 5.54804 19.7304 6.04503Z"
          fill="currentColor"
        />
      </svg>
      <Tooltip anchorSelect={`#${id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip }} />}
      </Tooltip>
    </div>
  );
}
