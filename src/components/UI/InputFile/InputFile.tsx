'use client';

import { type ChangeEvent, type MouseEvent, useRef } from 'react';

import styles from './InputFile.module.css';

type Props = {
  name: string;
  multiple?: boolean;
  accept: string;
  getChange: (e: ChangeEvent<HTMLInputElement>) => void; //eslint-disable-line
};

/**
 * Input в виде кнопки для загрузки файлов
 */
export default function InputFile({ name, multiple = false, accept, getChange }: Props) {
  const refInput = useRef<HTMLInputElement>(null);
  const getClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    if (refInput.current) {
      refInput.current.click();
    }
  };
  return (
    <div>
      <input
        ref={refInput}
        type="file"
        multiple={multiple}
        accept={accept}
        className={styles.hidden}
        onChange={getChange}
      />
      <button className={styles.btn} onClick={getClick}>
        {name}
      </button>
    </div>
  );
}