'use client';

import cn from 'classnames/bind';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxSelectSimple } from '@/types/index.interface';
import styles from './BoxSelect.module.css';

const cx = cn.bind(styles);

export default function BoxSelectSimple({
  state,
  setState,
  id,
  name,
  label,
  validationText,
  loading,
  options,
  ...props
}: PropsBoxSelectSimple) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
        <span className={styles.validate}>{validationText}</span>
      </label>
      <div className={styles.wrapper__relative}>
        <select
          className={cx('select', loading)}
          disabled={loading}
          {...props}
          name={name}
          id={id ? id : name}
          value={state || ''}
          onChange={(e) => setState(e.target.value)}
        >
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
