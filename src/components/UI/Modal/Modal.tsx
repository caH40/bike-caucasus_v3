'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdInfo } from 'react-icons/md';

import ButtonClose from '../ButtonClose/ButtonClose';
import styles from './Modal.module.css';
import { useModalStore } from '@/store/modal';

/**
 * Общее модальное окно по центру экрана
 */
export default function Modal() {
  const { isActive, title, body, resetModal } = useModalStore();
  const router = useRouter();

  // прослушка кнопки Escape для закрытия страницы аутентификации
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return;
      }
      resetModal();
      router.push('/');
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [resetModal, router]);
  const getClick = () => {
    resetModal();
    router.push('/');
  };

  return (
    isActive && (
      <div className={styles.background}>
        <div className={styles.wrapper}>
          <ButtonClose getClick={getClick} />
          <h2 className={styles.title}>
            <MdInfo size={26} className={styles.icon} />
            {title}
          </h2>
          {body}
        </div>
      </div>
    )
  );
}
