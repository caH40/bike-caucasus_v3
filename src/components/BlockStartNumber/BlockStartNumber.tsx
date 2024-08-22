import styles from './BlockStartNumber.module.css';
type Props = {
  startNumber: number | null;
};

/**
 * Блок отображения стартового номера райдера.
 */
export default function BlockStartNumber({ startNumber }: Props) {
  return <div className={styles.wrapper}>{startNumber ? startNumber : 'n/a'}</div>;
}
