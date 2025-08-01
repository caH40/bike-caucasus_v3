'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconSiteServices({
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
          d="M22.5504 14.4706C22.7987 14.4706 23 14.2073 23 13.8824V10.1177C23 9.79282 22.7987 9.5294 22.5504 9.5294H18.2043V6.9412H19.673C19.9213 6.9412 20.1226 6.67786 20.1226 6.35295V2.58825C20.1226 2.26342 19.9213 2 19.673 2H4.327C4.07872 2 3.87739 2.26335 3.87739 2.58825V6.35295C3.87739 6.67779 4.07867 6.9412 4.327 6.9412H5.79567V9.5294H1.44961C1.20133 9.5294 1 9.79274 1 10.1177V13.8824C1 14.2072 1.20128 14.4706 1.44961 14.4706H2.91828V17.0588H1.44961C1.20133 17.0588 1 17.3221 1 17.6471V21.4118C1 21.7366 1.20128 22 1.44961 22H5.28611C5.53438 22 5.73571 21.7367 5.73571 21.4118V17.6471C5.73571 17.3222 5.53444 17.0588 5.28611 17.0588H3.81744V14.4706H8.673V17.0588H7.20433C6.95606 17.0588 6.75473 17.3221 6.75473 17.6471V21.4118C6.75473 21.7366 6.956 22 7.20433 22H11.0408C11.2891 22 11.4904 21.7367 11.4904 21.4118V17.6471C11.4904 17.3222 11.2892 17.0588 11.0408 17.0588H9.57216V14.4706H11.0408C11.2891 14.4706 11.4904 14.2073 11.4904 13.8824V10.1177C11.4904 9.79282 11.2892 9.5294 11.0408 9.5294H6.69477V6.9412H17.3051V9.5294H12.9591C12.7108 9.5294 12.5095 9.79274 12.5095 10.1177V13.8824C12.5095 14.2072 12.7107 14.4706 12.9591 14.4706H14.4277V17.0588H12.9591C12.7108 17.0588 12.5095 17.3221 12.5095 17.6471V21.4118C12.5095 21.7366 12.7107 22 12.9591 22H16.7956C17.0438 22 17.2452 21.7367 17.2452 21.4118V17.6471C17.2452 17.3222 17.0439 17.0588 16.7956 17.0588H15.3269V14.4706H20.1825V17.0588H18.7138C18.4655 17.0588 18.2642 17.3221 18.2642 17.6471V21.4118C18.2642 21.7366 18.4655 22 18.7138 22H22.5503C22.7986 22 22.9999 21.7367 22.9999 21.4118V17.6471C22.9999 17.3222 22.7986 17.0588 22.5503 17.0588H21.0816V14.4706H22.5504ZM4.8365 18.2353V20.8235H1.89916V18.2353H4.8365ZM10.5913 18.2353V20.8235H7.65394V18.2353H10.5913ZM10.5913 10.7059V13.2941H1.89916V10.7059H10.5913ZM4.77655 5.7647V3.1765H19.2234V5.7647H4.77655ZM16.3461 18.2353V20.8235H13.4087V18.2353H16.3461ZM22.1008 18.2353V20.8235H19.1635V18.2353H22.1008ZM13.4087 13.2941V10.7059H22.1008V13.2941H13.4087Z"
          fill="currentColor"
        />
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
