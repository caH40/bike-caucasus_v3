'use client';

import { useLoadingStore } from '@/store/loading';
import styles from './ModalLoading.module.css';

export default function ModalLoading() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    isLoading && (
      <div className={styles.wrapper}>
        <div className={styles.spinner}></div>
      </div>
    )
  );
}
