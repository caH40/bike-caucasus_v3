'use client';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxInput } from '@/types/index.interface';
import styles from './BoxTextarea.module.css';

export default function BoxTextarea({
  id,
  label,
  validationText,
  register,
  ...props
}: PropsBoxInput) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
        <span className={styles.validate}>{validationText}</span>
      </label>
      <div className={styles.wrapper__relative}>
        <textarea {...props} {...register} className={styles.textarea} rows={5} />
        <div className={styles.checkmark}>
          <Checkmark isCompleted={!validationText} />
        </div>
      </div>
    </div>
  );
}
