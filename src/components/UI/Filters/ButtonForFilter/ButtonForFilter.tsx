'use client';

import cn from 'classnames/bind';

import styles from './ButtonForFilter.module.css';

const cx = cn.bind(styles);

type Props = {
  active: boolean;
  children: Readonly<React.ReactNode>;
  position: 'center' | 'left' | 'right';
  setActiveIdBtn: React.Dispatch<React.SetStateAction<number>>;
  id: number; // Номер (id) кнопки.
};

export default function ButtonForFilter({
  position,
  id,
  children,
  active,
  setActiveIdBtn,
}: Props) {
  return (
    <button
      onClick={() => setActiveIdBtn(id)}
      className={cx('button', {
        button__center: position === 'center',
        button__left: position === 'left',
        button__right: position === 'right',
        active: active,
      })}
      type={'button'}
    >
      {children}
    </button>
  );
}
