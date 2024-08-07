'use client';

import cn from 'classnames/bind';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxSelect } from '@/types/index.interface';
import styles from './BoxSelect.module.css';

const cx = cn.bind(styles);

export default function BoxSelectNew({
  id,
  label,
  validationText,
  register,
  loading,
  options,
  ...props
}: PropsBoxSelect) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
        <span className={styles.validate}>{validationText}</span>
      </label>
      <div className={styles.wrapper__relative}>
        <select className={cx('select', loading)} disabled={loading} {...props} {...register}>
          {options.map((elm) => (
            <option key={elm.id} value={elm.name} className={styles.option}>
              {elm.translation}
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
