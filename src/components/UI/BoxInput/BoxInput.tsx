'use client';

import cn from 'classnames/bind';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxInput } from '@/types/index.interface';
import styles from './BoxInput.module.css';
import IconInfo from '@/components/Icons/IconInfo';

const cx = cn.bind(styles);

export default function BoxInput({
  id,
  label,
  validationText,
  register,
  disabled,
  loading,
  tooltip,
  hideCheckmark,
  ...props
}: PropsBoxInput) {
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
        <input
          id={id}
          {...(props.type === 'number' && { step: 0.1 })}
          {...props}
          {...register}
          className={cx('input', loading, { hideCheckmark: hideCheckmark })}
          disabled={disabled || loading}
        />
        {!hideCheckmark && (
          <div className={styles.checkmark}>
            <Checkmark isCompleted={!validationText} />
          </div>
        )}
      </div>
    </div>
  );
}
