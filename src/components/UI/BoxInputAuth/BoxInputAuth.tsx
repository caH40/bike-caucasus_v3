'use client';

import Link from 'next/link';
import type { PropsBoxInputAuth } from '../../../types/index.interface';

import styles from './BoxInputAuth.module.css';

/**
 * Бокс с input с отображением валидации при вводе
 */
export default function BoxInputAuth({
  label,
  link,
  linkLabel,
  validationText,
  register,
  ...props
}: PropsBoxInputAuth) {
  return (
    <div className={styles.block}>
      <div className={styles.box__label}>
        <label>{label}</label>
        {link && (
          <Link className={styles.link} href={link} scroll={false}>
            {linkLabel}
          </Link>
        )}
      </div>

      <input {...props} {...register} className={styles.input} />
      <div className={styles.validation}>{validationText}</div>
    </div>
  );
}
