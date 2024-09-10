import styles from './Td.module.css';
type Props = {
  startNumber: number | null;
};

/**
 * Блок отображения стартового номера райдера.
 */
export default function BlockStartNumber({ startNumber }: Props) {
  return <div className={styles.numbers}>{startNumber ? startNumber : 'n/a'}</div>;
}
