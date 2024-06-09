'use client';

import cn from 'classnames/bind';

import type { PropsSelect } from '@/types/index.interface';
import styles from './Select.module.css';

const cx = cn.bind(styles);

export default function Select({
  state,
  setState,
  id,
  name,
  label,
  options,
  disabled,
  ...props
}: PropsSelect) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.wrapper__relative}>
        <select
          className={cx('select')}
          disabled={disabled}
          {...props}
          name={name}
          id={id ? id : name}
          value={state || ''}
          onChange={(e) => setState(e.target.value)}
        >
          {/* Если приходит value='' то показывается данный Лэйбл */}
          <option value="" className={styles.option} disabled>
            Все
          </option>
          {options.map((elm) => (
            <option key={elm.id} value={elm.name} className={styles.option}>
              {elm.translation}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
