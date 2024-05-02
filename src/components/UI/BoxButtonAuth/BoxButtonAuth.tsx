'use client';

import Link from 'next/link';

import styles from './BoxButtonAuth.module.css';

type Props = {
  help?: string;
  link?: string;
  linkLabel?: string;
  validationText?: string;
  children: React.ReactNode;
};

export default function BoxButtonAuth({
  help,
  link,
  linkLabel,
  validationText = '',
  children,
}: Props) {
  return (
    <div>
      <div className={styles.box__button}>
        <button className={styles.button} type="submit">
          {children}
        </button>
        <div className={styles.validation}>{validationText}</div>
      </div>

      <div className={styles.box__help}>
        <span>{help}</span>
        {link && (
          <Link className={styles.link} href={link} scroll={false}>
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
