'use client';

import { PropsBoxInput } from '@/types/index.interface';
import styles from './BoxInput.module.css';
import Checkmark from '@/components/Icons/Checkmark';

export default function BoxInput({
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
        <input {...props} {...register} className={styles.input} />
        <div className={styles.checkmark}>
          <Checkmark isCompleted={!validationText} />
        </div>
      </div>
    </div>
  );
}
