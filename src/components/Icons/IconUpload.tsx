'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

/**
 * Табличка для загрузки файлов "UL".
 */
export default function IconUpload({
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
        width="26"
        height="22"
        viewBox="0 0 26 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.9167 3.66675C24.9167 2.14797 23.4617 0.916748 21.6667 0.916748H4.33337C2.53845 0.916748 1.08337 2.14797 1.08337 3.66675V18.3334C1.08337 19.8522 2.53845 21.0834 4.33337 21.0834H21.6667C23.4617 21.0834 24.9167 19.8522 24.9167 18.3334V3.66675ZM22.75 3.66675C22.75 3.16049 22.265 2.75008 21.6667 2.75008H4.33337C3.73507 2.75008 3.25004 3.16049 3.25004 3.66675V18.3334C3.25004 18.8397 3.73507 19.2501 4.33337 19.2501H21.6667C22.265 19.2501 22.75 18.8397 22.75 18.3334V3.66675Z"
          fill="currentColor"
        />
        <path
          d="M11.0166 7.17969H12.6226V12.3467C12.6226 12.9482 12.4937 13.4549 12.2358 13.8667C11.9816 14.2785 11.6289 14.5882 11.1777 14.7959C10.7301 15.0036 10.2145 15.1074 9.63086 15.1074C9.0472 15.1074 8.52799 15.0036 8.07324 14.7959C7.62207 14.5882 7.26758 14.2785 7.00977 13.8667C6.75553 13.4549 6.62842 12.9482 6.62842 12.3467V7.17969H8.23975V12.3467C8.23975 12.6976 8.29525 12.984 8.40625 13.2061C8.51725 13.4281 8.6766 13.591 8.88428 13.6948C9.09554 13.7987 9.3444 13.8506 9.63086 13.8506C9.92448 13.8506 10.1733 13.7987 10.3774 13.6948C10.5851 13.591 10.7427 13.4281 10.8501 13.2061C10.9611 12.984 11.0166 12.6976 11.0166 12.3467V7.17969Z"
          fill="currentColor"
        />
        <path
          d="M19.8566 13.7432V15H15.9196V13.7432H19.8566ZM16.4405 7.17969V15H14.8292V7.17969H16.4405Z"
          fill="currentColor"
        />
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
