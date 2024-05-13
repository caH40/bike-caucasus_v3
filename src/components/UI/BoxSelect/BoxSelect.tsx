'use client';

import cn from 'classnames/bind';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxInput } from '@/types/index.interface';
import styles from './BoxSelect.module.css';

const cx = cn.bind(styles);

export default function BoxSelect({
  id,
  label,
  validationText,
  register,
  loading,
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
        <select className={cx('select', loading)} disabled={loading} {...props} {...register}>
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
