'use client';

import cn from 'classnames/bind';

import type { PropsSelect } from '@/types/index.interface';
import styles from './Select.module.css';

const cx = cn.bind(styles);

export default function Select<T extends string | number | readonly string[] | undefined>({
  state,
  setState,
  id,
  name,
  label,
  options,
  disabled,
  disabledEmpty,
  defaultValue,
  showEmpty = true,
  ...props
}: PropsSelect<T>) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={styles.wrapper__relative}>
        <select
          className={cx('select')}
          disabled={disabled}
          {...props}
          name={name}
          id={id ? id : name}
          value={state}
          onChange={(e) => setState(e.target.value as unknown as T)}
        >
          {showEmpty && (
            <option
              value={defaultValue || ''}
              className={styles.option}
              disabled={disabledEmpty}
            >
              Все
            </option>
          )}
          {options.map((elm) => (
            <option key={elm.id} value={elm.name} className={styles.option}>
              {elm.translation}
            </option>
          ))}
        </select>
      </div>
      {props.showValidationText && props.validationText && (
        <div className={styles.validationText}>{props.validationText}</div>
      )}
    </div>
  );
}
