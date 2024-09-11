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
  hideCheckmark,
  name,
  type,
  hasError,
  ...props
}: PropsBoxInputSimple<T>) {
  // Отключение отправки формы при нажатии Enter в полу input.
  const handlerEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

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
          className={cx('input', loading, { hideCheckmark: hideCheckmark, hasError: hasError })}
          disabled={disabled || loading}
          onKeyDown={handlerEnter}
        />
        {!hideCheckmark && (
          <div className={styles.checkmark}>
            <Checkmark isCompleted={!validationText} />
          </div>
        )}
      </div>
    </div>
  );
}
