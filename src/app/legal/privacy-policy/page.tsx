import DocumentFromJSON from '@/components/DocumentFromJSON/DocumentFromJSON';
import { privacyPolicy } from '@/locales/ru/privacy-policy.json';
import { applicationPrivacyPolicy } from '@/locales/ru/application-1.json';

import styles from '../Legal.module.css';

/**
 * Страница "Политика конфиденциальности".
 */
export default function PrivacyPolicy() {
  return (
    <div className={styles.wrapper}>
      <DocumentFromJSON dataJson={privacyPolicy} />
      <DocumentFromJSON dataJson={applicationPrivacyPolicy} />
    </div>
  );
}
