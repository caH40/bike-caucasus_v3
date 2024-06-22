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
        width="28"
        height="25"
        viewBox="0 0 28 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.7435 25H8.03177H0.980309C0.438689 25 0 24.5334 0 23.9573V8.64159C0 8.06548 0.438689 7.59886 0.980309 7.59886H8.03177C8.1053 7.59886 8.17637 7.60799 8.24499 7.62428L14.1391 1.1092C14.696 0.403405 15.5091 0 16.376 0H16.8202C18.4322 0 19.7434 1.39465 19.7434 3.10928V7.59952H24.7435C26.5393 7.59952 28 9.15318 28 11.0633V21.5368C28 23.4457 26.5393 25 24.7435 25ZM7.05147 9.68432H1.96061V22.9145H7.05147V9.68432ZM26.0394 11.0627C26.0394 10.3028 25.4579 9.68432 24.7435 9.68432H18.7625C18.2208 9.68432 17.7821 9.2177 17.7821 8.64159V3.10863C17.7821 2.54425 17.3502 2.0848 16.8196 2.0848H16.3754C16.0856 2.0848 15.8136 2.22231 15.6298 2.46214C15.6126 2.48429 15.5948 2.5058 15.5758 2.52665L9.01147 9.78272V22.9139H24.7435C25.4579 22.9139 26.0394 22.2954 26.0394 21.5355V11.0627Z"
          fill="currentColor"
        />
        <path
          d="M26.0394 11.0627C26.0394 10.3028 25.4579 9.68432 24.7435 9.68432H18.7625C18.2208 9.68432 17.7821 9.2177 17.7821 8.64159V3.10863C17.7821 2.54425 17.3502 2.0848 16.8196 2.0848H16.3754C16.0856 2.0848 15.8136 2.22231 15.6298 2.46214C15.6126 2.48429 15.5948 2.5058 15.5758 2.52665L9.01147 9.78272V22.9139H24.7435C25.4579 22.9139 26.0394 22.2954 26.0394 21.5355V11.0627Z"
          fill={isActive ? colors.active : 'none'}
        />
        <path
          d="M7.05147 9.68432H1.96061V22.9145H7.05147V9.68432Z"
          fill={isActive ? colors.active : 'none'}
        />
      </svg>
    </div>
  );
}
