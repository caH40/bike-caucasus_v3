import styles from './BlockMessage.module.css';

type Props = {
  children: React.ReactElement;
};

/**
 * Обертка для информационного блока.
 */
export default function BlockMessage({ children }: Props): React.ReactElement {
  return <div className={styles.wrapper}>{children}</div>;
}
