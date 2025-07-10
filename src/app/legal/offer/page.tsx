import t from '@/locales/ru/offer.json';

import styles from '../Legal.module.css';
import DocumentFromJSON from '@/components/DocumentFromJSON/DocumentFromJSON';

/**
 * Страница Пользовательского соглашения на оказание коммерческих услуг.
 */
export default function Offer() {
  return (
    <div className={styles.wrapper}>
      <DocumentFromJSON dataJson={t.offer} />
    </div>
  );
}
