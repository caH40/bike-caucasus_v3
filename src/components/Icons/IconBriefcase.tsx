'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconBriefcase({
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
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.625 10.5333H2.375V6.86667C2.375 6.05707 2.991 5.4 3.75 5.4H20.25C21.009 5.4 21.625 6.05707 21.625 6.86667V10.5333ZM10.625 12.7333C10.625 12.4649 10.6972 12.2171 10.8154 12H13.1846C13.3028 12.2171 13.375 12.4649 13.375 12.7333C13.375 13.5429 12.759 14.2 12 14.2C11.241 14.2 10.625 13.5429 10.625 12.7333ZM21.625 20.0667C21.625 20.8763 21.009 21.5333 20.25 21.5333H3.75C2.991 21.5333 2.375 20.8763 2.375 20.0667V12H9.34762C9.28987 12.2354 9.25 12.4781 9.25 12.7333C9.25 14.3533 10.4813 15.6667 12 15.6667C13.5187 15.6667 14.75 14.3533 14.75 12.7333C14.75 12.4781 14.7101 12.2354 14.6524 12H21.625V20.0667ZM9.25 3.2C9.25 2.7952 9.558 2.46667 9.9375 2.46667H14.0625C14.442 2.46667 14.75 2.7952 14.75 3.2V3.93333H9.25V3.2ZM20.25 3.93333H16.125V2.46667C16.125 1.65707 15.509 1 14.75 1H9.25C8.491 1 7.875 1.65707 7.875 2.46667V3.93333H3.75C2.23131 3.93333 1 5.24673 1 6.86667V20.0667C1 21.6866 2.23131 23 3.75 23H20.25C21.7687 23 23 21.6866 23 20.0667V6.86667C23 5.24673 21.7687 3.93333 20.25 3.93333Z"
          fill="currentColor"
        />
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
