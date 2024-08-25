'use client';

import TextareaAutosize from 'react-textarea-autosize';
import cn from 'classnames/bind';

import Checkmark from '@/components/Icons/Checkmark';
import type { PropsBoxInput } from '@/types/index.interface';
import styles from './BoxTextarea.module.css';
import IconInfo from '@/components/Icons/IconInfo';

const cx = cn.bind(styles);

export default function BoxTextarea({
  id,
  label,
  validationText,
  register,
  loading,
  tooltip,
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
        <TextareaAutosize
          {...props}
          {...register}
          className={cx('textarea', { loading })}
          disabled={loading}
          minRows={2} // Минимальное количество строк
        />
        <div className={styles.checkmark}>
          <Checkmark isCompleted={!validationText} />
        </div>
      </div>
    </div>
  );
}
