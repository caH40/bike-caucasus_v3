'use client';

import cn from 'classnames/bind';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxSelect } from '@/types/index.interface';
import styles from './BoxSelect.module.css';
import IconInfo from '@/components/Icons/IconInfo';

const cx = cn.bind(styles);

export default function BoxSelectNew({
  id,
  label,
  validationText,
  register,
  loading,
  options,
  tooltip,
  hideCheckmark,
  ...props
}: PropsBoxSelect) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        <div className={styles.box__info}>
          {label}
          {tooltip && <IconInfo squareSize={20} tooltip={tooltip} />}
        </div>
        <span className={styles.validate}>{validationText}</span>
      </label>
      <div className={styles.wrapper__relative}>
        <select
          className={cx('select', loading, { hideCheckmark: hideCheckmark })}
          disabled={loading}
          id={id}
          {...props}
          {...register}
        >
          <option value=""></option> {/* <-- пустая опция */}
          {options.map((elm) => (
            <option key={elm.id} value={elm.name} className={styles.option}>
              {elm.translation}
            </option>
          ))}
        </select>

        {!hideCheckmark && (
          <div className={styles.checkmark}>
            <Checkmark isCompleted={!validationText} />
          </div>
        )}
      </div>
    </div>
  );
}
