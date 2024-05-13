'use client';

import cn from 'classnames/bind';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxInput } from '@/types/index.interface';
import styles from './BoxTextarea.module.css';

const cx = cn.bind(styles);

export default function BoxTextarea({
  id,
  label,
  validationText,
  register,
  loading,
  ...props
}: PropsBoxInput) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
        <span className={styles.validate}>{validationText}</span>
      </label>
      <div className={styles.wrapper__relative}>
        <textarea
          {...props}
          {...register}
          className={cx('textarea', { loading })}
          disabled={loading}
          rows={5}
        />
        <div className={styles.checkmark}>
          <Checkmark isCompleted={!validationText} />
        </div>
      </div>
    </div>
  );
}
