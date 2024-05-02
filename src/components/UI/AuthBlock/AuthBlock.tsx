'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ButtonClose from '../ButtonClose/ButtonClose';
import styles from './AuthBlock.module.css';

type Props = {
  children: React.ReactNode;
};

/**
 * Контейнер-блок для всех операций связанных с аутентификацией.
 */
export default function AuthBlock({ children }: Props) {
  const router = useRouter();
  // прослушка кнопки Escape для закрытия страницы аутентификации
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return;
      }
      router.push('/', { scroll: false });
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [router]);

  const getClick = () => router.push('/', { scroll: false });

  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <div className={styles.block}>
          <ButtonClose getClick={getClick} />
          {children}
        </div>
      </div>
    </div>
  );
}
