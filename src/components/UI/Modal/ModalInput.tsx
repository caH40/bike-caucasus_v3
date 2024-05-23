import styles from './Modal.module.css';

/**
 * Модальное окно, только обёртка.
 */
export default function ModalSimple({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>{children}</div>
    </div>
  );
}
