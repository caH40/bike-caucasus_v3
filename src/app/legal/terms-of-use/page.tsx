import { termsOfUse } from '@/locales/ru/terms-of-use.json';

import styles from '../Legal.module.css';
import DocumentFromJSON from '@/components/DocumentFromJSON/DocumentFromJSON';

/**
 * Страница Пользовательского соглашения.
 */
export default function TermsOfUse() {
  return (
    <div className={styles.wrapper}>
      <DocumentFromJSON dataJson={termsOfUse} />
    </div>
  );
}
