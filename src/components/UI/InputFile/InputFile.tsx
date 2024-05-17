'use client';

import { type ChangeEvent, type MouseEvent, useRef } from 'react';
import cn from 'classnames/bind';

import styles from './InputFile.module.css';

const cx = cn.bind(styles);

type Props = {
  name: string;
  label: string;
  multiple?: boolean;
  accept: string;
  getChange: (e: ChangeEvent<HTMLInputElement>) => void; //eslint-disable-line
  loading?: boolean;
  disabled?: boolean;
};

/**
 * Input в виде кнопки для загрузки файлов
 */
export default function InputFile({
  label,
  name,
  multiple = false,
  accept,
  getChange,
  loading,
  disabled,
}: Props) {
  const refInput = useRef<HTMLInputElement>(null);
  const getClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    if (refInput.current) {
      refInput.current.click();
    }
  };
  return (
    <div className={styles.wrapper}>
      <input
        ref={refInput}
        type="file"
        multiple={multiple}
        accept={accept}
        className={cx('hidden')}
        onChange={getChange}
        name={name}
      />
      <button
        className={cx('btn', { loading: disabled || loading })}
        onClick={getClick}
        disabled={loading || disabled}
      >
        {label}
      </button>
    </div>
  );
}
