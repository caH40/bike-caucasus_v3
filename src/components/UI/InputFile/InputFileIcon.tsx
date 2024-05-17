'use client';

import { type ChangeEvent, useRef } from 'react';
import cn from 'classnames/bind';

import styles from './InputFile.module.css';
import Image from 'next/image';

const cx = cn.bind(styles);

type Props = {
  icon: { src: string; width: number; height: number; alt: string };
  name: string;
  multiple?: boolean;
  accept: string;
  getChange: (e: ChangeEvent<HTMLInputElement>) => void; //eslint-disable-line
  loading?: boolean;
  disabled?: boolean;
};

/**
 * Input в виде Icon для загрузки файлов
 */
export default function InputFileIcon({
  icon,
  name,
  multiple = false,
  accept,
  getChange,
  loading,
  disabled,
}: Props) {
  const refInput = useRef<HTMLInputElement>(null);
  const getClick = () => {
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
        disabled={disabled || loading}
      />
      <Image
        src={icon.src}
        width={icon.width}
        height={icon.height}
        alt={icon.alt}
        onClick={getClick}
        className={cx('btn__icon', { icon__disabled: disabled || loading })}
      />
    </div>
  );
}
