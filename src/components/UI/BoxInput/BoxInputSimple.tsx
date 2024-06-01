'use client';

import cn from 'classnames/bind';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxInputSimple } from '@/types/index.interface';
import styles from './BoxInput.module.css';

const cx = cn.bind(styles);

/**
 * Инпут без использования библиотеки react-hook-form
 */
export default function BoxInputSimple<T>({
  label,
  value,
  handlerInput,
  validationText,
  showValidationText,
  disabled,
  loading,
  name,
  type,
  ...props
}: PropsBoxInputSimple<T>) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={name}>
        {label}
        {showValidationText && <span className={styles.validate}>{validationText}</span>}
      </label>
      <div className={styles.wrapper__relative}>
        <input
          {...props}
          onChange={(e) =>
            handlerInput((type === 'number' ? +e.target.value : e.target.value) as T)
          }
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
