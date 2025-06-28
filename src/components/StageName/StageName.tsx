import styles from './StageName.module.css';

type Props = {
  name: string;
  stageOrder: number | null;
};

/**
 * Формирование строки названия этапа чемпионата.
 */
export default function StageName({ stageOrder, name }: Props) {
  return (
    <span>
      <span className={styles.stage}>Этап {stageOrder || 'Нет'}:</span> {name}
    </span>
  );
}
