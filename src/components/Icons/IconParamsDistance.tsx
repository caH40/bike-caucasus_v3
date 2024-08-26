'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconParamsDistance({
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
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30 7.82031L4.34888e-05 7.82031L4.34888e-05 22.1799L30 22.1799L30 7.82031ZM2.19149 20.5055C1.81931 20.5055 1.51729 20.2035 1.51729 19.8313L1.51729 10.1682C1.51729 9.79599 1.81931 9.49405 2.19149 9.49405L27.8089 9.49405C28.1811 9.49405 28.4831 9.79599 28.4831 10.1682L28.4831 19.8313C28.4831 20.2035 28.1811 20.5055 27.8089 20.5055L2.19149 20.5055Z"
          fill="currentColor"
        />
        <path
          d="M2.8657 10.8423L2.8657 19.1571H3.31507V17.4155C3.31507 17.0433 3.61709 16.7414 3.98927 16.7414C4.36146 16.7414 4.6634 17.0433 4.6634 17.4155V19.1571H5.11285L5.11285 14.9996C5.11285 14.6274 5.41486 14.3254 5.78705 14.3254C6.15923 14.3254 6.46117 14.6274 6.46117 14.9996L6.46117 19.1571H6.91062V17.4155C6.91062 17.0433 7.21263 16.7414 7.58482 16.7414C7.957 16.7414 8.25895 17.0433 8.25895 17.4155V19.1571H8.70839L8.70839 14.9996C8.70839 14.6274 9.01041 14.3254 9.38259 14.3254C9.75478 14.3254 10.0567 14.6274 10.0567 14.9996L10.0567 19.1571H10.5062V17.4155C10.5062 17.0433 10.8081 16.7414 11.1804 16.7414C11.5526 16.7414 11.8545 17.0433 11.8545 17.4155V19.1571L12.3039 19.1571V14.9996C12.3039 14.6274 12.6059 14.3254 12.9781 14.3254C13.3503 14.3254 13.6523 14.6274 13.6523 14.9996V19.1571H14.1017V17.4155C14.1017 17.0433 14.4037 16.7414 14.7759 16.7414C15.1481 16.7414 15.45 17.0433 15.45 17.4155V19.1571H15.8995V14.9996C15.8995 14.6274 16.2014 14.3254 16.5736 14.3254C16.9458 14.3254 17.2477 14.6274 17.2477 14.9996V19.1571H17.6972V17.4155C17.6972 17.0433 17.9991 16.7414 18.3713 16.7414C18.7435 16.7414 19.0455 17.0433 19.0455 17.4155V19.1571H19.495L19.495 14.9996C19.495 14.6274 19.7969 14.3254 20.1691 14.3254C20.5413 14.3254 20.8433 14.6274 20.8433 14.9996L20.8433 19.1571H21.2927L21.2927 17.4155C21.2927 17.0433 21.5947 16.7414 21.9669 16.7414C22.339 16.7414 22.6411 17.0433 22.6411 17.4155L22.6411 19.1571H23.0905L23.0905 14.9996C23.0905 14.6274 23.3924 14.3254 23.7646 14.3254C24.1368 14.3254 24.4388 14.6274 24.4388 14.9996L24.4388 19.1571H24.8882L24.8882 17.4155C24.8882 17.0433 25.1902 16.7414 25.5624 16.7414C25.9346 16.7414 26.2366 17.0433 26.2366 17.4155V19.1571H27.1348L27.1348 10.8423L2.8657 10.8423Z"
          fill="currentColor"
        />
      </svg>
      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
