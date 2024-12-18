'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconBikeMTB({
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
        aria-hidden="true"
        role="presentation"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.246 2.451a1.572 1.572 0 11-3.134.24 1.572 1.572 0 013.134-.24zM9.714 15.964a3.861 3.861 0 00-3.857-3.857A3.862 3.862 0 002 15.964a3.862 3.862 0 003.857 3.857 3.861 3.861 0 003.857-3.857zm-3.857 2.143c1.182 0 2.143-.96 2.143-2.143 0-1.182-.96-2.143-2.143-2.143-1.181 0-2.143.961-2.143 2.143s.962 2.143 2.143 2.143zm16.075-5.32a3.861 3.861 0 00-3.857-3.859 3.862 3.862 0 00-3.857 3.858 3.862 3.862 0 003.857 3.857 3.861 3.861 0 003.857-3.857zm-3.857 2.142c1.182 0 2.143-.96 2.143-2.143 0-1.182-.961-2.143-2.143-2.143-1.181 0-2.143.961-2.143 2.143s.962 2.143 2.143 2.143zm-3.521-8.634c-.817-.614-2.742-2.213-2.742-2.213a.981.981 0 00-1.385.074L6.322 7.107c-.643.571-.695 1.756-.357 2.178.429.536.614.689 1.535 1.215 1 .572 3.197 1.479 3.197 1.479l1.148 3.84 1.477-.462-1.091-4.235-.094-.313L8.89 8.836l3.283-2.072c.498.367 1.542 1.021 1.542 1.021s2.11.494 3.072.608l.428-1.286c-.41-.095-.828-.24-1.246-.387-.474-.165-.95-.33-1.415-.425zM9.629 21.5l-3.122 1.912-2.49-.732-1.532.943-.898-1.46L3.77 20.82l2.368.696L9 20l3.012-1.077 1.609 1.515 3.186-2.192 3.088.852 2.914-2.177.515 1.728-3.075 2.325-3.127-.863-3.67 2.523-2.034-1.914-1.79.78z"
          fill="currentColor"
        ></path>
      </svg>
      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
