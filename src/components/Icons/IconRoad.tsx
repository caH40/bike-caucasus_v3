'use client';

import cn from 'classnames/bind';
import { Tooltip } from 'react-tooltip';

import type { CSSVariables, TIconProps } from '@/types/index.interface';
import styles from './icons.module.css';

const cx = cn.bind(styles);

export default function IconRoad({
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
          d="M14.6019 16.2503L14.8701 15.7762C14.9552 15.6238 15.0344 15.4742 15.1089 15.3215C15.255 15.0174 15.3745 14.7087 15.4498 14.4037C15.6028 13.7879 15.5232 13.2231 15.1148 12.8048C14.7064 12.3782 14.0321 12.0919 13.3351 11.8924C11.8514 11.5009 10.334 11.0653 8.86594 10.5544C8.49741 10.4261 8.13065 10.2929 7.76536 10.1509C7.40555 10.0123 7.01545 9.85023 6.65855 9.63087C6.30572 9.41225 5.93569 9.12092 5.74467 8.67426C5.65003 8.45461 5.62519 8.20616 5.65701 7.98045C5.68912 7.75413 5.76951 7.54818 5.86926 7.36466C6.07673 6.98864 6.33131 6.71742 6.56072 6.42644L7.27486 5.57261L8.71809 3.88299L11.1753 1.04924L9.30211 1C9.30211 1 5.03526 4.59687 3.13069 6.86674C1.47487 8.83961 2.37928 10.5828 5.37459 11.7554C7.9027 12.7455 10.269 13.5119 10.269 13.5119C10.6767 13.7055 10.9667 14.0447 11.0631 14.4405C11.1595 14.8366 11.0529 15.2488 10.7705 15.5705L4.25245 23H10.7556L13.5215 18.1502L14.6019 16.2503Z"
          fill="currentColor"
        />
        <path
          d="M20.8581 12.2157C19.9504 10.8238 18.3965 9.84207 16.5964 9.52294L10.2189 8.29043C9.95302 8.24355 9.72947 8.08886 9.61659 7.87389C9.50372 7.65926 9.51577 7.41043 9.64837 7.20452L13.8878 1.12014L11.8229 1.06592L9.21225 4.23151L7.81762 5.94854L7.13198 6.81144C6.91134 7.10174 6.66806 7.38873 6.534 7.65724C6.39122 7.93482 6.35541 8.19938 6.45844 8.41899C6.55777 8.64402 6.80067 8.85327 7.09364 9.02141C7.39026 9.1935 7.71647 9.32305 8.07811 9.45299C8.43389 9.58189 8.79478 9.70414 9.15825 9.82132C10.6186 10.2917 12.0896 10.6788 13.6114 11.0442C14.3916 11.2571 15.2175 11.5424 15.8754 12.1786C16.1961 12.497 16.4354 12.9152 16.5263 13.3482C16.6198 13.7815 16.5892 14.2081 16.5073 14.6025C16.4211 14.9966 16.2863 15.3669 16.1281 15.7199C16.0482 15.8953 15.9619 16.0691 15.8736 16.2365L15.6164 16.7197L14.586 18.6447L12.2477 22.9999H18.8395L21.3329 16.7847C21.939 15.2732 21.7658 13.6076 20.8581 12.2157Z"
          fill="currentColor"
        />
      </svg>

      <Tooltip anchorSelect={`#${tooltip?.id}`} place="top" className={cx('tooltip')}>
        {tooltip && <div dangerouslySetInnerHTML={{ __html: tooltip.text }} />}
      </Tooltip>
    </div>
  );
}
