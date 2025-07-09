import { TEntityNameForSlot } from '@/types/index.interface';

import styles from './PaymentDetails.module.css';
import { ENTITY_NAME_TRANSLATIONS } from '@/constants/translations';

type Props = {
  entityName: TEntityNameForSlot;
  quantity: number;
};

/**
 * Отображение деталей платежа из metadata.
 */
export default function PaymentDetails({ entityName, quantity }: Props) {
  return (
    <dl className={styles.list}>
      <dt className={styles.title}>Сервис</dt>
      <dd className={styles.description}>{ENTITY_NAME_TRANSLATIONS[entityName]}</dd>

      <dt className={styles.title}>Количество</dt>
      <dd className={styles.description}>{quantity} шт.</dd>
    </dl>
  );
}
