import styles from './Wrapper.module.css';

type Props = {
  title: string;
  children: React.ReactNode;
};

/**
 * Блок для формы
 */
export default function Wrapper({ title, children }: Props) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{title}</h1>
      <hr className={styles.line} />
      {children}
    </div>
  );
}
