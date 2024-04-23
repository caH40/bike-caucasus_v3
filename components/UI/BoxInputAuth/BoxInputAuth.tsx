'use client';

import type { PropsBoxInputAuth } from '../../../types/index.interface';

import styles from './BoxInputAuth.module.css';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const getClick = () => {
    if (!link) {
      return;
    }
    router.push(link);
  };

  return (
    <div className={styles.block}>
      <div className={styles.box__label}>
        <label>{label}</label>
        {linkLabel ? (
          <span onClick={getClick} className={styles.link}>
            {linkLabel}
          </span>
        ) : (
          <span></span>
        )}
      </div>

      <input {...props} {...register} className={styles.input} />
      <div className={styles.validation}>{validationText}</div>
    </div>
  );
}
