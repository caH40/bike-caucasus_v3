'use client';

import cn from 'classnames/bind';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxInputSimple } from '@/types/index.interface';
import styles from './BoxInput.module.css';

const cx = cn.bind(styles);

/**
 * Инпут без использования библиотеки react-hook-form
 */
export default function BoxInputSimple({
  id,
  label,
  value,
  handlerInput,
  validationText,
  disabled,
  loading,
  ...props
}: PropsBoxInputSimple) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
        <span className={styles.validate}>{validationText}</span>
      </label>
      <div className={styles.wrapper__relative}>
        <input
          {...props}
          onChange={(e) => handlerInput(e.target.value)}
          value={value}
          className={cx('input', loading)}
          disabled={disabled || loading}
        />
        <div className={styles.checkmark}>
          <Checkmark isCompleted={!validationText} />
        </div>
      </div>
    </div>
  );
}
