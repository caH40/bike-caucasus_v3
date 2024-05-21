import TitleAndLine from '../UI/TitleAndLine/TitleAndLine';
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
      <TitleAndLine hSize={1} title={title} />
      <div className={styles.gaps}>{children}</div>
    </div>
  );
}
