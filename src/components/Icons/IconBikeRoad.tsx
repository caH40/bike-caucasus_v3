'use client';

import cn from 'classnames/bind';

import type { TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconBikeRoad({ isActive, squareSize = 24, getClick }: TIconProps) {
  return (
    <div
      onClick={getClick}
      className={cx('box', {
        interactive: getClick,
        active: isActive,
      })}
      style={{ width: squareSize, height: squareSize }}
    >
      <svg
        // aria-hidden="true"
        role="presentation"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.459 5.253c0 .858-.664 1.553-1.482 1.553-.82 0-1.483-.695-1.483-1.553S16.158 3.7 16.977 3.7c.818 0 1.482.695 1.482 1.553z"
          fill="currentColor"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 16.296c0 2.416 1.894 4.4 4.2 4.4s4.2-1.984 4.2-4.4c0-2.416-1.894-4.4-4.2-4.4S1 13.88 1 16.296zm4.2-2.674c-1.4 0-2.553 1.207-2.553 2.674 0 1.467 1.153 2.675 2.553 2.675s2.553-1.208 2.553-2.675c0-1.467-1.153-2.674-2.553-2.674zM13.6 16.296c0 2.416 1.894 4.4 4.2 4.4 2.388 0 4.2-1.984 4.2-4.4 0-2.416-1.894-4.4-4.2-4.4s-4.2 1.984-4.2 4.4zm4.2-2.674c-1.4 0-2.553 1.207-2.553 2.674 0 1.467 1.153 2.675 2.553 2.675s2.553-1.208 2.553-2.675c0-1.467-1.153-2.674-2.553-2.674z"
          fill="currentColor"
        ></path>
        <path
          d="M14.753 6.806l1.565 1.984 3.13.086v1.64l-3.46.172h-.412l-.247-.345-1.4-1.812c-.082.087-3.623.863-3.623.863l1.812 2.33.247.258v.26l.164 5.607-1.647.086-.164-5.262s-3.13-2.416-3.789-3.538c-.411-.69-.329-1.811.66-2.157 1.317-.43 5.352-1.38 5.352-1.38 1.07-.431 1.812 1.208 1.812 1.208z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );
}
