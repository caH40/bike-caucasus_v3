'use client';

import { PropsBoxInput } from '@/types/index.interface';
import Checkmark from '@/components/Icons/Checkmark';
import styles from './BoxSelect.module.css';

export default function BoxSelect({
  id,
  label,
  validationText,
  register,

  ...props
}: PropsBoxInput) {
  const options = ['мужской', 'женский'];
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
        <span className={styles.validate}>{validationText}</span>
      </label>
      <div className={styles.wrapper__relative}>
        <select className={styles.select} {...props} {...register}>
          {options.map((elm) => (
            <option key={elm} value={elm} className={styles.option}>
              {elm}
            </option>
          ))}
        </select>

        <div className={styles.checkmark}>
          <Checkmark isCompleted={!validationText} />
        </div>
      </div>
    </div>
  );
}
