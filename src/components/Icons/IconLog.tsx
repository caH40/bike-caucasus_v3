'use client';

import cn from 'classnames';

import type { TIconProps } from '@/types/index.interface';
import styles from './icon.module.css';

const cx = cn.bind(styles);

function IconLog({ isActive, squareSize = 24, getClick }: TIconProps) {
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1065_7)">
          <path
            d="M21.2822 8.58481H20.7059V5.80378C20.7059 5.78645 20.7032 5.76898 20.7008 5.75143C20.6999 5.64099 20.6647 5.53257 20.5891 5.44664L15.9619 0.160951C15.9605 0.159594 15.9591 0.159113 15.9582 0.157756C15.9306 0.126809 15.8985 0.101202 15.8644 0.0791842C15.8544 0.072312 15.8442 0.0666653 15.8337 0.0607561C15.8042 0.0447354 15.7729 0.0313848 15.7408 0.0217111C15.7321 0.0193036 15.7242 0.0157581 15.7156 0.0134819C15.6806 0.00516514 15.6443 0 15.6076 0H4.23529C3.71602 0 3.29414 0.422447 3.29414 0.941194V8.58442H2.71792C1.97506 8.58442 1.37271 9.18655 1.37271 9.92968V16.925C1.37271 17.6678 1.97506 18.2702 2.71792 18.2702H3.29414V23.0588C3.29414 23.5777 3.71602 24 4.23529 24H19.7647C20.2835 24 20.7058 23.5777 20.7058 23.0588V18.2702H21.2821C22.0248 18.2702 22.6272 17.6678 22.6272 16.9251V9.92994C22.6273 9.1866 22.0248 8.58481 21.2822 8.58481ZM4.23529 0.941194H15.137V5.75655C15.137 6.01651 15.3478 6.2271 15.6076 6.2271H19.7647V8.58473H4.23529V0.941194ZM13.9116 13.2817C13.9116 15.3727 12.6434 16.6411 10.7793 16.6411C8.88685 16.6411 7.77954 15.2123 7.77954 13.3953C7.77954 11.4833 9.00022 10.0546 10.8833 10.0546C12.8423 10.0546 13.9116 11.5215 13.9116 13.2817ZM3.59604 16.5368V10.1589H5.04373V15.3258H7.58007V16.5365H3.59604V16.5368ZM19.7647 22.8037H4.23529V18.2702H19.7647V22.8037H19.7647ZM20.1868 16.2436C19.742 16.3948 18.8998 16.6029 18.0576 16.6029C16.8938 16.6029 16.0514 16.3097 15.4646 15.7422C14.8782 15.1935 14.5563 14.3604 14.566 13.4237C14.5753 11.3035 16.1176 10.0922 18.2091 10.0922C19.0326 10.0922 19.6664 10.2537 19.9789 10.4047L19.676 11.559C19.3258 11.4077 18.8906 11.2847 18.1902 11.2847C16.9887 11.2847 16.08 11.9661 16.08 13.3478C16.08 14.6631 16.9032 15.4389 18.0861 15.4389C18.4172 15.4389 18.6825 15.4016 18.7957 15.3447V14.0101H17.8118V12.8842H20.1868V16.2436Z"
            fill="none"
          />
          <path
            d="M9.30307 13.3667C9.30307 14.6158 9.88993 15.4958 10.8549 15.4958C11.8296 15.4958 12.3878 14.5685 12.3878 13.3291C12.3878 12.1843 11.839 11.1993 10.8454 11.1993C9.87084 11.1993 9.30307 12.127 9.30307 13.3667Z"
            fill="none"
          />
        </g>
        <defs>
          <clipPath id="clip0_1065_7">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default IconLog;