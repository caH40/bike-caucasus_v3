'use client';

import cn from 'classnames/bind';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxInputSimple } from '@/types/index.interface';
import styles from './BoxTextarea.module.css';

const cx = cn.bind(styles);

/**
 * textarea без использования библиотеки react-hook-form
 * если есть кастомный обработчик получаемых данных handlerInput, то используется он
 */
export default function BoxTextareaSimple({
  name,
  value,
  label,
  validationText,
  showValidationText,
  loading,
  handlerInput,
  refTextArea,
  ...props
}: PropsBoxInputSimple) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={name}>
        {label}
        {showValidationText && <span className={styles.validate}>{validationText}</span>}
      </label>
      <div className={styles.wrapper__relative}>
        <textarea
          {...props}
          value={value}
          name={name}
          onChange={(e) => handlerInput(e.target.value)}
          className={cx('textarea', { loading })}
          disabled={loading}
          rows={5}
          ref={refTextArea}
        />
        <div className={styles.checkmark}>
          <Checkmark isCompleted={!validationText} />
        </div>
      </div>
    </div>
  );
}
