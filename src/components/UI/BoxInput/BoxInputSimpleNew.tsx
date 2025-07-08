'use client';

import cn from 'classnames/bind';

import styles from './BoxInput.module.css';
import type { PropsBoxInputSimpleNew } from '@/types/index.interface';

const cx = cn.bind(styles);

/**
 * Простой Инпут
 */
export default function BoxInputSimpleNew({
  label,
  value,
  setValue,
  disabled,
  loading,
  ...props
}: PropsBoxInputSimpleNew) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={props.id}>
        {label}
      </label>
      <div className={styles.wrapper__relative}>
        <input
          {...props}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className={cx('input', loading)}
          disabled={disabled || loading}
        />
      </div>
    </div>
  );
}
